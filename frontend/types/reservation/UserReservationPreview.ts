export interface UserReservationPreview {
    id: number;
    reservationTime: string;
    treatments: string[];
    employeeName: string;
    durationMinutes: number;
    totalPrice: number;
    status: string;
}

export interface UserReservationsPage {
    reservations: UserReservationPreview[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
}
