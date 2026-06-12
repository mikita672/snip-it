import { ScissorsIcon } from 'lucide-react'
import { Bodoni_Moda } from 'next/font/google'
import Link from 'next/link'
import ThemeSelection from './ThemeSelection'
import UserMenu from './UserMenu'
import { cookies } from 'next/headers'

const bodoni = Bodoni_Moda({
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
});

async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    let email = null;
    if (token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
            email = JSON.parse(payload).sub;
        } catch (e) {
            console.error(e);
        }
    }

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
					>Book</Link>

					<Link
						href="/appointments"
						className="text-sm text-primary cursor-pointer hover:opacity-75 uppercase"
					>My appointments</Link>
				</div>

				<ThemeSelection />

				<UserMenu email={email} />
			</div>
		</div>
	)
}

export default Header