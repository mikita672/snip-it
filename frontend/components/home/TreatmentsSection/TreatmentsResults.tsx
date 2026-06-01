import { TreatmentPreview } from '@/types/treatment/TreatmentPreview';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemTitle } from '../../ui/item';
import { ClockIcon } from 'lucide-react';

interface Props {
	params: URLSearchParams;
}

async function TreatmentsResults({ params }: Props) {
	const response = await fetch(`${process.env.API_URL}/treatment/preview?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		return <p className="text-center font-bold">Failed to parse services</p>
	}

	const data: TreatmentPreview[] = await response.json();

	if (data.length === 0) {
		return <p className="text-center font-bold">No services found...</p>
	}

	return (
		<div className="flex flex-col gap-1">
			{data.map((treatment) => (
				<Item key={treatment.id} className="bg-card hover:opacity-75 cursor-pointer border-foreground border-opacity-75">
					<ItemContent>
						<ItemTitle className="w-full flex items-center justify-between">
							<p className="font-bold">{treatment.name}</p>
							<p className="font-bold">${treatment.price}</p>
						</ItemTitle>
						<ItemDescription>{treatment.description}</ItemDescription>
						<ItemFooter>
							<div className="flex items-center gap-2 opacity-35 text-xs">
								<ClockIcon size={16} /> {treatment.minDurationMinutes}-{treatment.maxDurationMinutes} min
							</div>
						</ItemFooter>
					</ItemContent>
				</Item>
			))}
		</div>
	);
}

export default TreatmentsResults