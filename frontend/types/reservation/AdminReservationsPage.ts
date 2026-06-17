import type { AdminReservationPreview } from './AdminReservationPreview';

export type AdminReservationsPage = {
    reservations: AdminReservationPreview[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
};
