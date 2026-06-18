'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

interface Props {
    search: string
    setSearch: (val: string) => void
    statusFilter: string
    setStatusFilter: (val: string) => void
    setPage: (val: number) => void
}

export function ReservationsFilters({ search, setSearch, statusFilter, setStatusFilter, setPage }: Props) {
    const handleStatusChange = (val: string) => {
        setStatusFilter(val)
        setPage(0)
    }

    return (
        <div className="flex items-center gap-3">
            <Input
                placeholder="Search by user, stylist, or service..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
    )
}
