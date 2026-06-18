'use client';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Props {
    startItem: number;
    endItem: number;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    updateParams: (updates: Record<string, string | null>) => void;
}

export function AppointmentsPagination({
    startItem,
    endItem,
    totalElements,
    totalPages,
    currentPage,
    updateParams
}: Props) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                {startItem}-{endItem} of {totalElements}
            </div>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            text=""
                            onClick={() => updateParams({ page: Math.max(0, currentPage - 1).toString() })}
                            isActive={currentPage === 0}
                            className={currentPage === 0 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => updateParams({ page: i.toString() })}
                                isActive={currentPage === i}
                                className="cursor-pointer"
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            text=""
                            onClick={() => updateParams({ page: Math.min(totalPages - 1, currentPage + 1).toString() })}
                            isActive={currentPage === totalPages - 1}
                            className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
