import EmployeesSection from "@/components/home/EmployeesSection";
import GreetingsSection from "@/components/home/GreetingsSection"
import TreatmentsSection from "@/components/home/TreatmentsSection/TreatmentsSection";
import { Separator } from "@/components/ui/separator"

interface Props {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function HomePage({ searchParams }: Props) {
	const params = new URLSearchParams();
	Object.entries(await searchParams).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach(v => params.append(key, v));
		} else if (value !== undefined) {
			params.append(key, value);
		}
	});

	return (
		<div className="flex flex-col gap-8">
			<GreetingsSection />

			<Separator />

			<div className="grid grid-cols-3 gap-12">
				<TreatmentsSection params={params} />

				<EmployeesSection />
			</div>
		</div>
	)
}

export default HomePage