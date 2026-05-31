package com.snipit.backend.treatment;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.treatment.dto.TreatmentPreviewDTO;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/treatment")
public class TreatmentController {
	private final TreatmentService treatmentService;

	public TreatmentController(TreatmentService treatmentService) {
		this.treatmentService = treatmentService;
	}

	@GetMapping("/preview")
	public List<TreatmentPreviewDTO> getTreatmentPreviews(
		@RequestParam(defaultValue = "1")
		Integer pageNumber,
		@RequestParam(defaultValue = "PRICE")
		TreatmentService.SortBy sortBy,
		@RequestParam(defaultValue = "false")
		boolean sortDescending
	) {
		return treatmentService.getTreatmentPreviews(pageNumber - 1, sortBy, sortDescending);
	}

}
