'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'
import type { AdminReservationsPage } from '@/types/reservation/AdminReservationsPage'

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase()
    if (s === 'pending')
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Pending</Badge>
    if (s === 'confirmed')
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Confirmed</Badge>
    if (s === 'completed')
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Completed</Badge>
    if (s === 'cancelled')
        return <Badge variant="destructive">Cancelled</Badge>
    return <Badge variant="outline">{status}</Badge>
}

export default function AdminReservationsTable() {
    const [data, setData] = useState<AdminReservationsPage | null>(null)
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(0)
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    const fetchReservations = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: '10',
                sort: 'reservationTime',
                direction: 'desc',
            })
            if (debouncedSearch) params.set('search', debouncedSearch)
            if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)

            const res = await fetch(`/api/reservation?${params}`)
            if (!res.ok) return
            const json: AdminReservationsPage = await res.json()
            setData(json)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch, statusFilter])

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const handleStatusChange = async (reservation: AdminReservationPreview, newStatus: string) => {
        if (reservation.status === newStatus) return
        setUpdatingId(reservation.id)
        try {
            const res = await fetch(`/api/reservation/${reservation.id}/status?status=${newStatus}`, {
                method: 'PATCH',
            })
            if (res.ok) {
                setData(prev => prev ? {
                    ...prev,
                    reservations: prev.reservations.map(r =>
                        r.id === reservation.id ? { ...r, status: newStatus } : r
                    ),
                } : prev)
            }
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search by user, stylist, or service..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0) }}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Stylist</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Change Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : !data || data.reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No reservations found.
                                </TableCell>
                            </TableRow>
                        ) : data.reservations.map(r => {
                            const dateObj = new Date(r.reservationTime)
                            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                            return (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        <div className="font-medium">{dateStr}</div>
                                        <div className="text-sm text-muted-foreground">{timeStr}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{r.userFullName}</div>
                                        <div className="text-sm text-muted-foreground">{r.userEmail}</div>
                                    </TableCell>
                                    <TableCell className="max-w-[180px] truncate" title={r.treatments.join(', ')}>
                                        {r.treatments.join(', ')}
                                    </TableCell>
                                    <TableCell>{r.employeeName}</TableCell>
                                    <TableCell>{r.durationMinutes} min</TableCell>
                                    <TableCell>${Number(r.totalPrice).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={r.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={r.status}
                                            onValueChange={val => handleStatusChange(r, val)}
                                            disabled={updatingId === r.id}
                                        >
                                            <SelectTrigger className="w-36">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUSES.map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {data.currentPage * 10 + 1}–{Math.min((data.currentPage + 1) * 10, Number(data.totalElements))} of {data.totalElements}
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
            )}
        </div>
    )
}
