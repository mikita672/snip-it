"use client";

import { ScissorsIcon } from "lucide-react";
import { Bodoni_Moda } from "next/font/google";
import Link from "next/link";
import ThemeSelection from "./ThemeSelection";
import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "700",
  style: "italic",
});

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="py-3 px-4 md:px-24 flex justify-between items-center border-b">
      <Link href="/">
        <div
          className={`text-xl cursor-pointer hover:opacity-85 hover:text-primary
						${bodoni.className} flex items-center gap-2 transition-colors`}
        >
          <ScissorsIcon size={20} />
          <span>Snip-it</span>
        </div>
      </Link>

      <div className="flex gap-8 items-center">
        <div className="hidden md:flex gap-4">
          <Link
            href="/book"
            className="text-sm text-primary cursor-pointer hover:opacity-75 uppercase"
          >
            Book
          </Link>

          <Link
            href="/profile?tab=appointments"
            className="text-sm text-primary cursor-pointer hover:opacity-75 uppercase"
          >
            My appointments
          </Link>
        </div>

        <ThemeSelection />

        <UserMenu user={user} />
      </div>
    </div>
  );
}
