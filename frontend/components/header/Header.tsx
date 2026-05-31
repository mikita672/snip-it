import { Scissors } from 'lucide-react'
import { Bodoni_Moda } from 'next/font/google'
import Link from 'next/link'

const bodoni = Bodoni_Moda({
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
})

function Header() {
	return (
		<div className="py-3 px-24 flex justify-between items-center border-b">
			<Link href="/">
				<div
					className={`text-xl cursor-pointer hover:opacity-85 hover:text-primary
						${bodoni.className} flex items-center gap-2 transition-colors`}
				>
					<Scissors size={20} />
					<span>Snip-it</span>
				</div>
			</Link>

			<div className="flex gap-12">
				<div className="flex gap-4">
					<Link
						href="/services"
						className="text-sm text-primary cursor-pointer hover:opacity-75"
					>SERVICES</Link>

					<Link
						href="/appointments"
						className="text-sm text-primary cursor-pointer hover:opacity-75"
					>MY APPOINTMENTS</Link>
				</div>
			</div>
		</div>
	)
}

export default Header