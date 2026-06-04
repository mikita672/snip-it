package com.snipit.backend.employee.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record EmployeeTreatmentsPreviewDTO(
	int totalCount,
	List<String> treatments
) {}