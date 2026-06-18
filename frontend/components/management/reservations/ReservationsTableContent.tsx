'use client'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { SortIcon } from '@/components/appointments/SortIcon'
import { ReservationsTableRow } from './ReservationsTableRow'
import type { AdminReservationsPage } from '@/types/reservation/AdminReservationsPage'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'

interface Props {
    loading: boolean
    data: AdminReservationsPage | null
    updatingId: number | null
    handleStatusChange: (reservation: AdminReservationPreview, newStatus: string) => void
    handleSort: (field: string) => void
    currentSort: string
    currentDirection: string
}

export function ReservationsTableContent({ loading, data, updatingId, handleStatusChange, handleSort, currentSort, currentDirection }: Props) {
    const hasNoData = !data || data.reservations.length === 0

    const sortableHead = (label: string, field: string) => (
        <TableHead
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon field={field} currentSort={currentSort} currentDirection={currentDirection} />
            </div>
        </TableHead>
    )

    return (
        <div className="rounded-xl border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {sortableHead('Date', 'reservationTime')}
                        {sortableHead('User', 'user.firstName')}
                        {sortableHead('Services', 'treatments.name')}
                        {sortableHead('Stylist', 'employee.firstName')}
                        {sortableHead('Duration', 'sumDuration')}
                        {sortableHead('Total', 'totalPrice')}
                        {sortableHead('Status', 'status')}
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
                    ) : hasNoData ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                No reservations found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.reservations.map(r => (
                            <ReservationsTableRow 
                                key={r.id} 
                                reservation={r} 
                                updatingId={updatingId} 
                                handleStatusChange={handleStatusChange} 
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
