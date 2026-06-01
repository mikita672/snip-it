import { Bodoni_Moda } from "next/font/google";

const bodoniNormal = Bodoni_Moda({
	subsets: ['latin'],
	weight: '400'
});

const bodoniItalic = Bodoni_Moda({
	subsets: ['latin'],
	weight: '400',
	style: 'italic',
});

function GreetingsSection() {
	return (
		<div className="md:w-[50%] flex flex-col gap-2">
			<p className="text-primary">Est. 2018 · Paris & London</p>

			<div className={`text-5xl ${bodoniNormal.className}`}>
				A salon for those who <p className={bodoniItalic.className}>understand the difference.</p>
			</div>
		</div>
	)
}

export default GreetingsSection