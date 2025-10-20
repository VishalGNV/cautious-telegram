"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function WaitlistSuccess() {
  const [data, setData] = useState<{
    email: string;
    referralCode: string;
    position: number;
  } | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("waitlistData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No waitlist data found. Please{" "}
              <Link href="/" className="text-primary hover:underline">
                join the waitlist
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const referralUrl = `${window.location.origin}?ref=${data.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="max-w-2xl w-full border-2">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="text-6xl">🎉</div>
          <CardTitle className="text-3xl">You&apos;re on the List!</CardTitle>
          <p className="text-muted-foreground">
            Thanks for joining the LinkHub waitlist! You&apos;re one of the early
            supporters.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your spot</p>
              <Badge variant="secondary" className="text-2xl px-4 py-2">
                #{data.position}
              </Badge>
            </div>
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Your referral code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
                <Button onClick={handleCopyLink} variant="secondary">
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-base">What&apos;s next?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <span>Check your inbox for a welcome email</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔗</span>
                <span>Share your referral link to move up the list</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🎁</span>
                <span>Early adopters get lifetime perks and exclusive features</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📢</span>
                <span>We&apos;ll notify you when we launch</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
