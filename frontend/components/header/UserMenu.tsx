"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ClipboardClockIcon, LogOut, SquareChevronDownIcon, UserIcon, UserPenIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function UserMenu({ email }: { email?: string | null }) {
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (response.status === 401) {
            router.push('/login');
            return;
        }
        if (response.ok) {
            toast.success("Logged out successfully");
            router.refresh();
        } else {
            toast.error("Failed to log out");
        }
    }

	if (email) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center gap-2 cursor-pointer">
						<UserIcon />
						<div className="flex gap-1 items-center">
							<p>{email}</p>
							<SquareChevronDownIcon size={20} />
						</div>
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
	)
}

export default UserMenu