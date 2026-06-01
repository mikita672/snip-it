import { ScissorsIcon } from 'lucide-react'
import { Bodoni_Moda } from 'next/font/google'
import Link from 'next/link'
import ThemeSelection from './ThemeSelection'
import UserMenu from './UserMenu'

const bodoni = Bodoni_Moda({
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
});

function Header() {
	return (
		<div className="py-3 px-2 md:px-24 flex justify-between items-center border-b">
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
						href="/services"
						className="text-sm text-primary cursor-pointer hover:opacity-75 uppercase"
					>Services</Link>

					<Link
						href="/appointments"
						className="text-sm text-primary cursor-pointer hover:opacity-75 uppercase"
					>My appointments</Link>
				</div>

				<ThemeSelection />

				<UserMenu />
			</div>
		</div>
	)
}

export default Header