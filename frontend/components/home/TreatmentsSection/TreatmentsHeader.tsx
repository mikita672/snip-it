"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type SortBy = "PRICE" | "DURATION";

function TreatmentsHeader() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const rawSortBy = searchParams.get('sortBy');
	const sortBy: SortBy = (rawSortBy === "PRICE" || rawSortBy === "DURATION")
		? rawSortBy
		: "PRICE";
	const sortDescending = (searchParams.get('sortDescending') ?? "false") === "true";

	const handleSortSelection = (value: string) => {
		const [newSortBy, newSortDescendingStr] = value.split('_');
		const newSortDescending = newSortDescendingStr === "desc";

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('sortBy', newSortBy);
		newSearchParams.set('sortDescending', `${newSortDescending}`);
		router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
		router.refresh();
	}

	return (
		<div>
			<div className="w-full text-sm flex justify-between items-center">
				<p className="uppercase">Services</p>

				<div className="flex gap-1 items-center">
					<p className="opacity-75">Sort: </p>

					<Select
						value={`${sortBy}_${sortDescending ? "desc" : "asc"}`}
						onValueChange={handleSortSelection}
					>
						<SelectTrigger className="bg-card">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent className="bg-card">
							<SelectGroup>
								<SelectItem value="PRICE_asc">Price (cheap first)</SelectItem>
								<SelectItem value="PRICE_desc">Price (cheap last)</SelectItem>
								<SelectItem value="DURATION_asc">Duration (short first)</SelectItem>
								<SelectItem value="DURATION_desc">Duration (short last)</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}

export default TreatmentsHeader