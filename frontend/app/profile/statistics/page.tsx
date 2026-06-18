"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatisticsTab from "@/components/statistics/StatisticsTab";
import { useAuth } from "@/contexts/AuthContext";

export default function StatisticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/profile");
    }
  }, [loading, user, router]);

  if (loading || !user || !user.isAdmin) {
    return null;
  }

  return <StatisticsTab />;
}
