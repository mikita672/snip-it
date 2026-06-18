"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ManagementTab from "@/components/management/ManagementTab";
import { useAuth } from "@/contexts/AuthContext";

export default function ManagementPage() {
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

  return <ManagementTab />;
}
