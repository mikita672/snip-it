package com.snipit.backend.treatment;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.treatment.dto.TreatmentDTOMapper;
import com.snipit.backend.treatment.dto.TreatmentPreviewDTO;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/treatment")
public class TreatmentController {
	private final TreatmentService treatmentService;
	private final TreatmentDTOMapper treatmentDTOMapper;

	public TreatmentController(TreatmentService treatmentService, TreatmentDTOMapper treatmentDTOMapper) {
		this.treatmentService = treatmentService;
		this.treatmentDTOMapper = treatmentDTOMapper;
	}

	@GetMapping("/preview")
	public List<TreatmentPreviewDTO> getTreatmentPreviews(
		@RequestParam(defaultValue = "1")
		Integer pageNumber,
		@RequestParam(defaultValue = "PRICE")
		TreatmentService.SortBy sortBy,
		@RequestParam(defaultValue = "false")
		boolean sortDescending,
		@RequestParam(defaultValue = "")
		String searchToken
	) {
		Page<Treatment> page = treatmentService.getTreatmentPreviews(
			pageNumber - 1,
			sortBy,
			sortDescending,
			searchToken.trim()
		);
		return page.stream()
			.map(treatmentDTOMapper::previewDTOFromEntity)
			.toList();
	}

}
