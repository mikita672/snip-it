'use client'

import { useState, useEffect, useCallback } from 'react'
import { ReservationsFilters } from './ReservationsFilters'
import { ReservationsTableContent } from './ReservationsTableContent'
import { ReservationsPagination } from './ReservationsPagination'
import { toast } from 'sonner'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'
import type { AdminReservationsPage } from '@/types/reservation/AdminReservationsPage'

export default function ReservationsTable() {
    const [data, setData] = useState<AdminReservationsPage | null>(null)
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sort, setSort] = useState('reservationTime')
    const [direction, setDirection] = useState('desc')
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(0)
        }, 400)
        
        return () => clearTimeout(timer)
    }, [search])

    const handleSort = (field: string) => {
        if (sort === field) {
            setDirection(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSort(field)
            setDirection('asc')
        }
        setPage(0)
    }

    const fetchReservations = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: '10',
                sort,
                direction,
            })
            
            if (debouncedSearch) {
                params.set('search', debouncedSearch)
            }
            
            if (statusFilter !== 'all') {
                params.set('status', statusFilter)
            }

            const res = await fetch(`/api/reservation?${params}`)
            
            if (!res.ok) {
                return
            }
            
            const json: AdminReservationsPage = await res.json()
            setData(json)
        } finally {
            setLoading(false)
        }
    }, [page, debouncedSearch, statusFilter, sort, direction])

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const handleStatusChange = async (reservation: AdminReservationPreview, newStatus: string) => {
        if (reservation.status === newStatus) {
            return
        }
        
        setUpdatingId(reservation.id)
        
        try {
            const res = await fetch(`/api/reservation/${reservation.id}/status?status=${newStatus}`, {
                method: 'PATCH',
            })
            
            if (res.ok) {
                setData(prev => {
                    if (!prev) {
                        return prev
                    }
                    
                    return {
                        ...prev,
                        reservations: prev.reservations.map(r =>
                            r.id === reservation.id ? { ...r, status: newStatus } : r
                        ),
                    }
                })
                toast.success('Reservation status updated')
            } else {
                toast.error('Failed to update status')
            }
        } catch {
            toast.error('Failed to update status')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <ReservationsFilters 
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setPage={setPage}
            />

            <ReservationsTableContent
                loading={loading}
                data={data}
                updatingId={updatingId}
                handleStatusChange={handleStatusChange}
                handleSort={handleSort}
                currentSort={sort}
                currentDirection={direction}
            />

            <ReservationsPagination 
                data={data}
                page={page}
                setPage={setPage}
            />
        </div>
    )
}
