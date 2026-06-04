"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
	totalPages: number;
}

function TreatmentsPagination({ totalPages }: Props) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1")

	const selectPage = (newPageNumber: number) => {
		if (newPageNumber === pageNumber) {
			return;
		}
		if (newPageNumber < 1 || newPageNumber > totalPages) {
			return;
		}
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("pageNumber", newPageNumber.toString());
		router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
		router.refresh();
	}

	const pages = [];
	for (let i = Math.max(1, pageNumber - 1); i <= Math.min(totalPages, pageNumber + 1); ++i) {
		pages.push(i);
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem
					className={pageNumber === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
					onClick={() => selectPage(pageNumber - 1)}
				>
					<PaginationPrevious />
				</PaginationItem>
				{pages.map((i) => (
					<PaginationItem
						className={i === pageNumber ? "" : "cursor-pointer"}
						key={i}
						onClick={() => selectPage(i)}
					>
						<PaginationLink isActive={i === pageNumber}>{i}</PaginationLink>
					</PaginationItem>
				))}
				{
					pageNumber + 1 >= totalPages ? <></> :
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
				}
				<PaginationItem
					className={pageNumber === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
					onClick={() => selectPage(pageNumber + 1)}
				>
					<PaginationNext />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}

export default TreatmentsPagination