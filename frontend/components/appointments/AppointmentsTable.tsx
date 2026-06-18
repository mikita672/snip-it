'use client';

import { useState, useTransition, useEffect } from 'react';
import { UserReservationsPage } from '@/types/reservation/UserReservationPreview';
import { toast } from 'sonner';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentsTableContent } from './AppointmentsTableContent';
import { AppointmentsPagination } from './AppointmentsPagination';

interface Props {
    initialData: UserReservationsPage;
}

export default function AppointmentsTable({ initialData }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

    const currentSort = searchParams.get('sort') || 'reservationTime';
    const currentDirection = searchParams.get('direction') || 'desc';
    const currentStatus = searchParams.get('status') || 'all';
    const currentSize = searchParams.get('size') || '5';

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearchParam = searchParams.get('search') || '';

            if (searchValue !== currentSearchParam) {
                updateParams({ search: searchValue || null });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchValue]);

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

    const startItem = initialData.currentPage * Number(currentSize) + 1;
    const endItem = Math.min((initialData.currentPage + 1) * Number(currentSize), initialData.totalElements);

    return (
        <div className="w-full space-y-4">
            <AppointmentsFilters
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleSearch={handleSearch}
                currentStatus={currentStatus}
                currentSize={currentSize}
                updateParams={updateParams}
            />

            <AppointmentsTableContent
                reservations={initialData.reservations}
                handleSort={handleSort}
                currentSort={currentSort}
                currentDirection={currentDirection}
                loadingId={loadingId}
                handleCancel={handleCancel}
            />

            <AppointmentsPagination
                startItem={startItem}
                endItem={endItem}
                totalElements={initialData.totalElements}
                totalPages={initialData.totalPages}
                currentPage={initialData.currentPage}
                updateParams={updateParams}
            />
        </div>
    );
}
