'use client'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ReservationsTableRow } from './ReservationsTableRow'
import type { AdminReservationsPage } from '@/types/reservation/AdminReservationsPage'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'

interface Props {
    loading: boolean
    data: AdminReservationsPage | null
    updatingId: number | null
    handleStatusChange: (reservation: AdminReservationPreview, newStatus: string) => void
}

export function ReservationsTableContent({ loading, data, updatingId, handleStatusChange }: Props) {
    const hasNoData = !data || data.reservations.length === 0

    return (
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
