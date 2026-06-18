'use client'

import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
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
                    
                    {Array.from({ length: data.totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                isActive={i === page}
                                onClick={e => { e.preventDefault(); setPage(i) }}
                                className="cursor-pointer"
                            >
                                {i + 1}
                            </PaginationLink>
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
