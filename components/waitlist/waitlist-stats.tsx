"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export function WaitlistStats() {
  const [stats, setStats] = useState({ total: 0, weekly: 0 });
  const [displayWeekly, setDisplayWeekly] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/waitlist/join");
        const data = await response.json();
        setStats({ total: data.total, weekly: data.weekly });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate counter
  useEffect(() => {
    if (stats.weekly === 0) return;

    let current = 0;
    const increment = Math.ceil(stats.weekly / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= stats.weekly) {
        setDisplayWeekly(stats.weekly);
        clearInterval(timer);
      } else {
        setDisplayWeekly(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [stats.weekly]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-pulse">
          <Badge variant="secondary" className="h-16 w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <Badge
        variant="outline"
        className="text-base px-6 py-3 border-2 hover:border-primary/50 transition-colors"
      >
        <span className="text-xl mr-2">🎉</span>
        <span className="font-semibold">
          {displayWeekly.toLocaleString()} creator{displayWeekly !== 1 ? "s" : ""} joined
        </span>
        <span className="text-muted-foreground ml-1">in the last 7 days</span>
      </Badge>
    </div>
  );
}
