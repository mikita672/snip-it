'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserReservationPreview } from '@/types/reservation/UserReservationPreview';
import { AppointmentsTableRow } from './AppointmentsTableRow';
import { SortIcon } from './SortIcon';

interface Props {
    reservations: UserReservationPreview[];
    handleSort: (field: string) => void;
    currentSort: string;
    currentDirection: string;
    loadingId: number | null;
    handleCancel: (id: number) => void;
}

export function AppointmentsTableContent({
    reservations,
    handleSort,
    currentSort,
    currentDirection,
    loadingId,
    handleCancel
}: Props) {
    return (
        <div className="rounded-md border bg-card overflow-hidden">
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead 
                            className="w-45 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('reservationTime')}
                        >
                            <div className="flex items-center">
                                Date <SortIcon field="reservationTime" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead 
                            className="w-62.5 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('treatments.name')}
                        >
                            <div className="flex items-center">
                                Services <SortIcon field="treatments.name" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead 
                            className="w-37.5 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('employee.firstName')}
                        >
                            <div className="flex items-center">
                                Stylist <SortIcon field="employee.firstName" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead 
                            className="w-27.5 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('sumDuration')}
                        >
                            <div className="flex items-center">
                                Duration <SortIcon field="sumDuration" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead 
                            className="w-25 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('totalPrice')}
                        >
                            <div className="flex items-center">
                                Total <SortIcon field="totalPrice" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead 
                            className="w-30 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Status <SortIcon field="status" currentSort={currentSort} currentDirection={currentDirection} />
                            </div>
                        </TableHead>
                        <TableHead className="w-25 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No appointments found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reservations.map((res) => (
                            <AppointmentsTableRow 
                                key={res.id} 
                                res={res} 
                                loadingId={loadingId} 
                                handleCancel={handleCancel} 
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
