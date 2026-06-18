'use client'

import { Button } from '@/components/ui/button'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import type { AdminReservationPreview } from '@/types/reservation/AdminReservationPreview'

interface Props {
    reservation: AdminReservationPreview
    targetStatus: string
    buttonText: string
    isDestructive?: boolean
    loadingId: number | null
    handleStatusChange: (reservation: AdminReservationPreview, newStatus: string) => void
}

export function StatusActionButton({
    reservation,
    targetStatus,
    buttonText,
    isDestructive = false,
    loadingId,
    handleStatusChange
}: Props) {
    const isUpdating = loadingId === reservation.id

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={isDestructive ? 'ghost' : 'outline'}
                    size="sm"
                    disabled={isUpdating}
                    className={isDestructive ? 'text-destructive hover:underline hover:bg-transparent px-2 h-auto' : 'px-3 h-8'}
                >
                    {isUpdating ? '...' : buttonText}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark this reservation as {targetStatus.toLowerCase()}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange(reservation, targetStatus)}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
