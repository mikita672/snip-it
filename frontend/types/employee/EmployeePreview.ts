import { EmployeeTreatmentsPreview } from "./EmployeeTreatmentsPreview";

export type EmployeePreview = {
	id: number;
	firstName: string;
	lastName: string;
	position: string;
	email: string;
	phone: string;
	isActive: boolean;
	treatmentIds: number[];
	treatmentsPreview: EmployeeTreatmentsPreview;
}
