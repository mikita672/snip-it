import { Item, ItemContent, ItemDescription, ItemFooter, ItemTitle } from '../../ui/item';
import { ClockIcon } from 'lucide-react';
import TreatmentsPagination from './TreatmentsPagination';
import { TreatmentsPreviewPage } from '@/types/treatment/TreatmentsPreviewPage';
import { serverFetch } from '@/lib/fetch';
import Link from 'next/link';

interface Props {
	params: URLSearchParams;
}

async function TreatmentsResults({ params }: Props) {
	const response = await serverFetch(`/api/treatment/preview?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		return <p className="text-center font-bold">Failed to parse services</p>
	}

	const data: TreatmentsPreviewPage = await response.json();

	if (data.treatments.length === 0) {
		return <p className="text-center font-bold">No services found...</p>
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				{data.treatments.map((treatment) => (
					<Link key={treatment.id} href={`/services?${params.toString()}&treatment=${treatment.id}`}>
						<Item className="bg-card hover:opacity-75 cursor-pointer border-foreground border-opacity-75">
							<ItemContent>
								<ItemTitle className="w-full flex items-center justify-between">
									<p className="font-bold">{treatment.name}</p>
									<p className="font-bold">${treatment.price}</p>
								</ItemTitle>
								<ItemDescription>{treatment.description}</ItemDescription>
								<ItemFooter>
									<div className="flex items-center gap-2 opacity-35 text-xs">
										<ClockIcon size={16} /> {treatment.durationMinutes} min
									</div>
								</ItemFooter>
							</ItemContent>
						</Item>
					</Link>
				))}
			</div>

			<TreatmentsPagination totalPages={data.totalPages} />
		</div>
	);
}

export default TreatmentsResults