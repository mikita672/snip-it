package com.snipit.backend.treatment.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record TreatmentsPreviewPageDTO(
	List<TreatmentPreviewDTO> treatments,
	int totalPages
) {}
