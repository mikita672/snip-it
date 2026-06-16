package com.snipit.backend.treatment.dto;

import java.math.BigDecimal;

public record TreatmentRequestDTO(
	String name,
	String description,
	Integer durationMinutes,
	BigDecimal price
) {}