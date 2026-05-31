import GreetingsSection from "@/components/home/GreetingsSection"
import { Separator } from "@/components/ui/separator"

function HomePage() {
	return (
		<div className="flex flex-col gap-8">
			<GreetingsSection />

			<Separator />
		</div>
	)
}

export default HomePage