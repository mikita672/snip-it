"use client"

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";

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
	const [searchToken, setSearchToken] = useState(searchParams.get('searchToken') ?? "");

	const handleSortSelection = (value: string) => {
		const [newSortBy, newSortDescendingStr] = value.split('_');
		const newSortDescending = newSortDescendingStr === "desc";

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('sortBy', newSortBy);
		newSearchParams.set('sortDescending', `${newSortDescending}`);
		router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
		router.refresh();
	}

	const handleSearch = (e: React.SubmitEvent) => {
		e.preventDefault();
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('searchToken', searchToken);
		router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-4">
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


			<form onSubmit={handleSearch}>
				<Field className="bg-card">
					<ButtonGroup>
						<InputGroup>
							<InputGroupAddon>
								<SearchIcon />
							</InputGroupAddon>
							<InputGroupInput
								value={searchToken}
								onChange={(e) => setSearchToken(e.target.value)}
								placeholder="Search services..."
							/>
						</InputGroup>
						<Button
							className="cursor-pointer hover:opacity-75"
							type="submit"
						>Search</Button>
					</ButtonGroup>
				</Field>
			</form>
		</div>
	)
}

export default TreatmentsHeader