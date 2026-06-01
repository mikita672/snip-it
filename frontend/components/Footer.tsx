import { ScissorsIcon } from "lucide-react";
import { Bodoni_Moda } from "next/font/google";
import Link from "next/link";

const bodoni = Bodoni_Moda({
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
});


function Footer() {
	return (
		<div className="p-4 md:px-24 md:py-8 flex gap-4 flex-col md:flex-row md:justify-between md:items-center border-t">
			<div>
				<div
					className={`text-xl ${bodoni.className} flex items-center gap-2`}
				>
					<ScissorsIcon size={20} />
					<span>Snip-it</span>
				</div>

				<p className="opacity-35 text-xs">14 Pont Street, London SW1X 9EL</p>
			</div>

			<div className="flex gap-4 text-sm">
				<Link href="/privacy" className="hover:underline hover:opacity-75">
					Privacy
				</Link>
				<Link href="/terms-and-conditions" className="hover:underline hover:opacity-75">
					Terms and conditions
				</Link>
				<Link href="/contact" className="hover:underline hover:opacity-75">
					Contact
				</Link>
			</div>
		</div>
	)
}

export default Footer