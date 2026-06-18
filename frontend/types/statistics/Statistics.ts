export interface MonthlyStat {
    month: number;
    appointments: number;
    income: number;
}

export interface GeneralStats {
    monthlyStats: MonthlyStat[];
    availableYears: number[];
    averageMonthlyIncome: number;
    totalIncome: number;
    totalAppointments: number;
}

export interface EmployeeStats {
    employeeId: number;
    employeeName: string;
    averageMonthlyIncome: number;
    totalAppointments: number;
    totalIncome: number;
    monthlyStats: MonthlyStat[];
}

export interface TreatmentStats {
    treatmentId: number;
    treatmentName: string;
    totalAppointments: number;
    totalIncome: number;
    monthlyStats: MonthlyStat[];
}
