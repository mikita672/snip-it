'use client';

import { useState, useTransition } from 'react';
import { UserReservationsPage, UserReservationPreview } from '@/types/reservation/UserReservationPreview';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    initialData: UserReservationsPage;
}

export default function AppointmentsTable({ initialData }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

    const currentSort = searchParams.get('sort') || 'reservationTime';
    const currentDirection = searchParams.get('direction') || 'desc';
    const currentStatus = searchParams.get('status') || 'all';
    const currentSize = searchParams.get('size') || '5';

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        if (!updates.page && updates.page !== '0') {
            params.set('page', '0');
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleSearch = (formData: FormData) => {
        const query = formData.get('search') as string;
        updateParams({ search: query || null });
    };

    const handleSort = (field: string) => {
        const direction = currentSort === field && currentDirection === 'asc' ? 'desc' : 'asc';
        updateParams({ sort: field, direction });
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (currentSort !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        return currentDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />;
    };

    const handleCancel = async (id: number) => {
        setLoadingId(id);
        try {
            const response = await fetch(`/api/reservation/${id}?status=Cancelled`, {
                method: 'PATCH',
            });
            if (response.status === 401) {
                router.push('/login');
                return;
            }
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

    const startItem = initialData.currentPage * Number(currentSize) + 1;
    const endItem = Math.min((initialData.currentPage + 1) * Number(currentSize), initialData.totalElements);

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <form action={handleSearch} className="relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="search"
                        type="search"
                        placeholder="Search appointments..."
                        className="pl-9"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select
                        value={currentStatus}
                        onValueChange={(value) => updateParams({ status: value })}
                    >
                        <SelectTrigger className="w-37.5">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentSize}
                        onValueChange={(value) => updateParams({ size: value })}
                    >
                        <SelectTrigger className="w-25">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 rows</SelectItem>
                            <SelectItem value="10">10 rows</SelectItem>
                            <SelectItem value="20">20 rows</SelectItem>
                            <SelectItem value="50">50 rows</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead 
                                className="w-50 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('reservationTime')}
                            >
                                <div className="flex items-center">
                                    DATE <SortIcon field="reservationTime" />
                                </div>
                            </TableHead>
                            <TableHead>SERVICES</TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('employee.firstName')}
                            >
                                <div className="flex items-center">
                                    STYLIST <SortIcon field="employee.firstName" />
                                </div>
                            </TableHead>
                            <TableHead 
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleSort('sumDuration')}
                            >
                                <div className="flex items-center">
                                    DURATION <SortIcon field="sumDuration" />
                                </div>
                            </TableHead>
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
                                    onClick={() => updateParams({ page: Math.max(0, initialData.currentPage - 1).toString() })}
                                    isActive={initialData.currentPage === 0}
                                    className={initialData.currentPage === 0 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: initialData.totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => updateParams({ page: i.toString() })}
                                        isActive={initialData.currentPage === i}
                                        className="cursor-pointer"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    text=""
                                    onClick={() => updateParams({ page: Math.min(initialData.totalPages - 1, initialData.currentPage + 1).toString() })}
                                    isActive={initialData.currentPage === initialData.totalPages - 1}
                                    className={initialData.currentPage === initialData.totalPages - 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
