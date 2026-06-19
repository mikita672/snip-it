"use client";

import { Bodoni_Moda } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
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
  const router = useRouter();
  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && !user && !error) {
      router.replace("/login");
    }
  }, [loading, user, error, router]);

  if (loading || (!user && !error)) {
    return (
      <div className="flex flex-col gap-6 px-[4%] py-6 md:py-12">
        <p className="text-center text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-6 px-[4%] py-6 md:py-12">
        <p className="text-center font-bold text-destructive">
          Failed to load profile
        </p>
      </div>
    );
  }

  const visibleTabs = tabs.filter((t) => !t.adminOnly || user.isAdmin);

  return (
    <div className="flex flex-col gap-8 px-[4%] py-6 md:py-12 w-full max-w-[1800px] mx-auto">
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
