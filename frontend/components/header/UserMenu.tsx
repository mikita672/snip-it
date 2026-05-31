"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ClipboardClockIcon, LogOut, SquareChevronDownIcon, UserIcon, UserPenIcon } from "lucide-react";
import { Separator } from "../ui/separator";

function UserMenu() {
	const [user, setUser] = useState(false);

	if (user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center gap-2 cursor-pointer">
						<UserIcon />
						<div className="flex gap-1 items-center">
							<p>user@user.me</p>
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
						onClick={() => setUser(false)}
					>
						<LogOut />
						<p>Logout</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		// <Link href="/login">
		<Button className="cursor-pointer" onClick={() => setUser(true)}>Login</Button>
		// </Link>
	)
}

export default UserMenu