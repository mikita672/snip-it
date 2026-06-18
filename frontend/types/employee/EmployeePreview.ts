import { EmployeeTreatmentsPreview } from "./EmployeeTreatmentsPreview";

export type EmployeePreview = {
	firstName: string;
	lastName: string;
	position: string;
	isActive: boolean;
	treatmentsPreview: EmployeeTreatmentsPreview;
}
