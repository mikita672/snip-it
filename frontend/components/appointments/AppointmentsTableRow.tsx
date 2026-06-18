'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { UserReservationPreview } from '@/types/reservation/UserReservationPreview';
import { Badge } from '@/components/ui/badge';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';

interface Props {
    res: UserReservationPreview;
    loadingId: number | null;
    handleCancel: (id: number) => void;
}

export function AppointmentsTableRow({ res, loadingId, handleCancel }: Props) {
    const dateObj = new Date(res.reservationTime);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const status = res.status.toLowerCase();
    const isCancellable = status.includes('pending') || status.includes('confirmed');

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('pending')) {
            return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">Pending</Badge>;
        }
        if (s.includes('confirm') || s.includes('complet')) {
            return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">{status}</Badge>;
        }
        if (s.includes('cancel')) {
            return <Badge variant="destructive">{status}</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    };

    return (
        <TableRow>
            <TableCell className="truncate">
                <div className="font-medium">{dateStr}</div>
                <div className="text-sm text-muted-foreground">{timeStr}</div>
            </TableCell>
            <TableCell className="truncate" title={res.treatments.join(', ')}>
                {res.treatments.join(', ')}
            </TableCell>
            <TableCell className="truncate">{res.employeeName}</TableCell>
            <TableCell className="truncate">{res.durationMinutes} min</TableCell>
            <TableCell className="truncate">${res.totalPrice}</TableCell>
            <TableCell className="truncate">
                {getStatusBadge(res.status)}
            </TableCell>
            <TableCell className="text-center">
                <div className="flex items-center justify-center gap-4">
                    {isCancellable && (
                        <CancelAppointmentDialog
                            id={res.id}
                            loadingId={loadingId}
                            handleCancel={handleCancel}
                        />
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
