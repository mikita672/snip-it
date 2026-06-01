"use client"

import { useTheme } from "next-themes"
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CogIcon, MoonIcon, SunIcon } from "lucide-react";

function ThemeSelection() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon-sm" className="cursor-pointer">
					<SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					className="cursor-pointer flex gap-4 items-center"
					onClick={() => setTheme("light")}
				>
					<SunIcon />
					<p>Light</p>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer flex gap-4 items-center"
					onClick={() => setTheme("dark")}
				>
					<MoonIcon />
					<p>Dark</p>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer flex gap-4 items-center"
					onClick={() => setTheme("system")}
				>
					<CogIcon />
					<p>System</p>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ThemeSelection