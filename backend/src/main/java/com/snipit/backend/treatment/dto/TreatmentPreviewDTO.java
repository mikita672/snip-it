package com.snipit.backend.treatment.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record TreatmentPreviewDTO(
	Integer id,
	String name,
	String description,
	Integer minDurationMinutes,
	Integer maxDurationMinutes,
	BigDecimal price
) {}
