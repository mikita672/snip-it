package com.snipit.backend.treatment.dto;

import org.springframework.stereotype.Component;

import com.snipit.backend.treatment.Treatment;

@Component
public class TreatmentDTOMapper {
	public TreatmentPreviewDTO previewDTOFromEntity(Treatment treatment) {
		return TreatmentPreviewDTO.builder()
			.id(treatment.getId())
			.name(treatment.getName())
			.description(treatment.getDescription())
			.durationMinutes(treatment.getDurationMinutes())
			.price(treatment.getPrice())
			.isActive(treatment.getIsActive())
			.build();
	}
}
