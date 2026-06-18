"use client";

import { Bodoni_Moda } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "400",
});

const tabs = [
  { href: "/profile", label: "Profile" },
  { href: "/profile/appointments", label: "Appointments" },
  { href: "/profile/management", label: "Management", adminOnly: true },
  { href: "/profile/statistics", label: "Statistics", adminOnly: true },
];

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
        <p className="text-center text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
        <p className="text-center font-bold text-destructive">
          Failed to load profile
        </p>
      </div>
    );
  }

  const visibleTabs = tabs.filter((t) => !t.adminOnly || user.isAdmin);

  return (
    <div className="flex flex-col gap-8 md:px-24 md:py-12 py-6 px-4 max-w-8xl mx-auto">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className={`text-4xl ${bodoni.className}`}>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <nav
        className={cn(
          "grid w-full bg-muted/50 rounded-4xl p-0.75 text-muted-foreground h-9",
          user.isAdmin ? "md:w-200 grid-cols-4" : "md:w-100 grid-cols-2",
        )}
      >
        {visibleTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors hover:text-foreground",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-foreground/60",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
