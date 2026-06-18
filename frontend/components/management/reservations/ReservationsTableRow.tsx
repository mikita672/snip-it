'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { StatusBadge } from './StatusBadge'
import { StatusActionButton } from './StatusActionButton'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'

interface Props {
    reservation: AdminReservationPreview
    updatingId: number | null
    handleStatusChange: (reservation: AdminReservationPreview, newStatus: string) => void
}

export function ReservationsTableRow({ reservation, updatingId, handleStatusChange }: Props) {
    const dateObj = new Date(reservation.reservationTime)
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

    const currentStatus = reservation.status.toLowerCase()
    const isPending = currentStatus === 'pending'
    const isConfirmed = currentStatus === 'confirmed'
    const isActionable = isPending || isConfirmed

    return (
        <TableRow>
            <TableCell>
                <div className="font-medium">{dateStr}</div>
                <div className="text-sm text-muted-foreground">{timeStr}</div>
            </TableCell>
            <TableCell>
                <div className="font-medium">{reservation.userFullName}</div>
                <div className="text-sm text-muted-foreground">{reservation.userEmail}</div>
            </TableCell>
            <TableCell className="max-w-[180px] truncate" title={reservation.treatments.join(', ')}>
                {reservation.treatments.join(', ')}
            </TableCell>
            <TableCell>{reservation.employeeName}</TableCell>
            <TableCell>{reservation.durationMinutes} min</TableCell>
            <TableCell>${Number(reservation.totalPrice).toFixed(2)}</TableCell>
            <TableCell>
                <StatusBadge status={reservation.status} />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {isPending && (
                        <>
                            <StatusActionButton 
                                reservation={reservation} 
                                targetStatus="Confirmed" 
                                buttonText="Confirm" 
                                loadingId={updatingId} 
                                handleStatusChange={handleStatusChange} 
                            />
                            <StatusActionButton 
                                reservation={reservation} 
                                targetStatus="Cancelled" 
                                buttonText="Cancel" 
                                isDestructive 
                                loadingId={updatingId} 
                                handleStatusChange={handleStatusChange} 
                            />
                        </>
                    )}
                    
                    {isConfirmed && (
                        <>
                            <StatusActionButton 
                                reservation={reservation} 
                                targetStatus="Completed" 
                                buttonText="Complete" 
                                loadingId={updatingId} 
                                handleStatusChange={handleStatusChange} 
                            />
                            <StatusActionButton 
                                reservation={reservation} 
                                targetStatus="Cancelled" 
                                buttonText="Cancel" 
                                isDestructive 
                                loadingId={updatingId} 
                                handleStatusChange={handleStatusChange} 
                            />
                        </>
                    )}

                    {!isActionable && (
                        <span className="text-sm text-muted-foreground">-</span>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}
