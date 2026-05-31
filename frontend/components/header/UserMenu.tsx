"use client"

import Link from "next/link"
import { Button } from "../ui/button"

function UserMenu() {
	return (
		<Link href="/login">
			<Button className="cursor-pointer">Login</Button>
		</Link>
	)
}

export default UserMenu