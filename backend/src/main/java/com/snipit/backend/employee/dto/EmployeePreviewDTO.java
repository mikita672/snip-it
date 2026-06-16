package com.snipit.backend.employee.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record EmployeePreviewDTO(
	Integer id,
	String firstName,
	String lastName,
	String position,
	String email,
	String phone,
	Boolean isActive,
	List<Integer> treatmentIds,
	EmployeeTreatmentsPreviewDTO treatmentsPreview
) {}
