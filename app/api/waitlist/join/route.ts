import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Generate a unique referral code
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude ambiguous characters
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, referredBy, metadata } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("waitlist_entries")
      .select("email")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const { data: existingCode } = await supabase
        .from("waitlist_entries")
        .select("referral_code")
        .eq("referral_code", referralCode)
        .single();

      if (!existingCode) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode();
        attempts++;
      }
    }

    // Find referred_by user if referral code provided
    let referredByUuid = null;
    if (referredBy) {
      const { data: referrer } = await supabase
        .from("waitlist_entries")
        .select("id")
        .eq("referral_code", referredBy)
        .single();

      if (referrer) {
        referredByUuid = referrer.id;
      }
    }

    // Insert new waitlist entry
    const { data: newEntry, error: insertError } = await supabase
      .from("waitlist_entries")
      .insert({
        email: normalizedEmail,
        referral_code: referralCode,
        referred_by: referredByUuid,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    // Get current position in waitlist
    const { count } = await supabase
      .from("waitlist_entries")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      data: {
        id: newEntry.id,
        email: newEntry.email,
        referralCode: newEntry.referral_code,
        position: count || 0,
      },
    });
  } catch (error) {
    console.error("Waitlist join error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total signups
    const { count: total } = await supabase
      .from("waitlist_entries")
      .select("*", { count: "exact", head: true });

    // Get weekly signups
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: weekly } = await supabase
      .from("waitlist_entries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    return NextResponse.json({
      total: total || 0,
      weekly: weekly || 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
