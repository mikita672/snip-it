export type AdminReservationPreview = {
    id: number;
    reservationTime: string;
    treatments: string[];
    employeeName: string;
    durationMinutes: number;
    totalPrice: number;
    status: string;
    userFullName: string;
    userEmail: string;
};
