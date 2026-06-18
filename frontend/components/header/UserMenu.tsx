"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ClipboardClockIcon,
  LayoutDashboardIcon,
  LogOut,
  SquareChevronDownIcon,
  UserIcon,
  UserPenIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UserProfile } from "@/types/user/UserProfile";

function UserMenu({ user }: { user?: UserProfile | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.status === 401) {
      router.push("/login");
      return;
    }
    if (response.ok) {
      router.push("/login");
    } else {
      toast.error("Failed to log out");
    }
  };

  if (user !== undefined && user !== null) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <UserIcon />
            <div className="flex flex-col gap-0 items-start">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <SquareChevronDownIcon size={20} className="ml-1" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer flex gap-2 items-center">
              <UserPenIcon />
              <p>Profile</p>
            </DropdownMenuItem>
          </Link>
          <Link href="/appointments">
            <DropdownMenuItem className="cursor-pointer flex gap-2 items-center">
              <ClipboardClockIcon />
              <p>Appointments</p>
            </DropdownMenuItem>
          </Link>
          {user.isAdmin && (
            <Link href="/profile/management">
              <DropdownMenuItem className="cursor-pointer flex gap-2 items-center">
                <LayoutDashboardIcon />
                <p>Admin panel</p>
              </DropdownMenuItem>
            </Link>
          )}
          <Separator />
          <DropdownMenuItem
            className="cursor-pointer flex gap-2 items-center"
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut />
            <p>Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login">
      <Button className="cursor-pointer">Login</Button>
    </Link>
  );
}

export default UserMenu;
