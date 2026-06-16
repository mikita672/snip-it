'use client';

import { useState } from 'react';
import { UserReservationsPage, UserReservationPreview } from '@/types/reservation/UserReservationPreview';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    initialData: UserReservationsPage;
}

export default function AppointmentsTable({ initialData }: Props) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleCancel = async (id: number) => {
        setLoadingId(id);
        try {
            const response = await fetch(`/api/reservation/${id}?status=Cancelled`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error();
            }
            toast.success('Appointment cancelled successfully');
            router.refresh();
        } catch {
            toast.error('Failed to cancel appointment');
        } finally {
            setLoadingId(null);
        }
    };

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

    const startItem = initialData.currentPage * 5 + 1;
    const endItem = Math.min((initialData.currentPage + 1) * 5, initialData.totalElements);

    return (
        <div className="w-full">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">DATE</TableHead>
                            <TableHead>SERVICES</TableHead>
                            <TableHead>STYLIST</TableHead>
                            <TableHead>DURATION</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead className="text-center">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No appointments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.reservations.map((res) => {
                                const dateObj = new Date(res.reservationTime);
                                const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                                return (
                                    <TableRow key={res.id}>
                                        <TableCell>
                                            <div className="font-medium">{dateStr}</div>
                                            <div className="text-sm text-muted-foreground">{timeStr}</div>
                                        </TableCell>
                                        <TableCell>{res.treatments.join(', ')}</TableCell>
                                        <TableCell>{res.employeeName}</TableCell>
                                        <TableCell>{res.durationMinutes} min</TableCell>
                                        <TableCell>${res.totalPrice}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(res.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                {res.status.toLowerCase().includes('pending') && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                disabled={loadingId === res.id}
                                                                className="text-sm text-destructive hover:underline disabled:opacity-50 px-0 hover:bg-transparent h-auto"
                                                            >
                                                                {loadingId === res.id ? '...' : 'Cancel'}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Don't cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleCancel(res.id)}>Yes, cancel</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {initialData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                        {startItem}-{endItem} of {initialData.totalElements}
                    </div>
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    text=""
                                    href={`?page=${Math.max(0, initialData.currentPage - 1)}`}
                                    isActive={initialData.currentPage === 0}
                                    className={initialData.currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: initialData.totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href={`?page=${i}`}
                                        isActive={initialData.currentPage === i}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    text=""
                                    href={`?page=${Math.min(initialData.totalPages - 1, initialData.currentPage + 1)}`}
                                    isActive={initialData.currentPage === initialData.totalPages - 1}
                                    className={initialData.currentPage === initialData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
