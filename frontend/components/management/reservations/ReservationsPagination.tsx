'use client'

import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis
} from '@/components/ui/pagination'
import type { AdminReservationsPage } from '@/types/reservation/AdminReservationsPage'

interface Props {
    data: AdminReservationsPage | null
    page: number
    setPage: (val: number | ((prev: number) => number)) => void
}

export function ReservationsPagination({ data, page, setPage }: Props) {
    if (!data) {
        return null
    }

    if (data.totalPages <= 1) {
        return null
    }

    const startItem = data.currentPage * 10 + 1
    const endItem = Math.min((data.currentPage + 1) * 10, Number(data.totalElements))

    const getVisiblePages = () => {
        const total = data.totalPages
        const current = page

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i)
        }

        if (current <= 3) {
            return [0, 1, 2, 3, 4, -1, total - 1]
        }

        if (current >= total - 4) {
            return [0, -1, total - 5, total - 4, total - 3, total - 2, total - 1]
        }

        return [0, -1, current - 1, current, current + 1, -1, total - 1]
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {startItem}–{endItem} of {data.totalElements}
            </div>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={e => { e.preventDefault(); setPage(p => Math.max(0, p - 1)) }}
                            aria-disabled={page === 0}
                            className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    
                    {getVisiblePages().map((pageNum, index) => (
                        <PaginationItem key={`${pageNum}-${index}`}>
                            {pageNum === -1 ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    isActive={pageNum === page}
                                    onClick={e => { e.preventDefault(); setPage(pageNum) }}
                                    className="cursor-pointer"
                                >
                                    {pageNum + 1}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                        <PaginationNext
                            onClick={e => { e.preventDefault(); setPage(p => Math.min(data.totalPages - 1, p + 1)) }}
                            aria-disabled={page === data.totalPages - 1}
                            className={page === data.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
