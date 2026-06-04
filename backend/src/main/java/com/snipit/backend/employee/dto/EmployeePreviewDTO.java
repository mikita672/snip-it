package com.snipit.backend.employee.dto;

import lombok.Builder;

@Builder
public record EmployeePreviewDTO(
	String firstName,
	String lastName,
	String position,
	EmployeeTreatmentsPreviewDTO treatmentsPreview
) {}
