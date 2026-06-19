'use client';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

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

    const getVisiblePages = () => {
        const total = totalPages;
        const current = currentPage;

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i);
        }

        if (current <= 3) {
            return [0, 1, 2, 3, 4, -1, total - 1];
        }

        if (current >= total - 4) {
            return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1];
        }

        return [0, -1, current - 1, current, current + 1, -1, total - 1];
    };

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
                    
                    {getVisiblePages().map((pageNum, index) => (
                        <PaginationItem key={`${pageNum}-${index}`}>
                            {pageNum === -1 ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => updateParams({ page: pageNum.toString() })}
                                    isActive={currentPage === pageNum}
                                    className="cursor-pointer"
                                >
                                    {pageNum + 1}
                                </PaginationLink>
                            )}
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
