package com.snipit.backend.treatment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.snipit.backend.treatment.dto.TreatmentRequestDTO;

@Service
public class TreatmentService {
	private final TreatmentRepository treatmentRepository;
	private final static int PAGE_SIZE = 6;
	
	public enum SortBy {
		PRICE,
		DURATION;

		String asString() {
			return switch (this) {
				case PRICE -> "price";
				case DURATION -> "durationMinutes";
			};
		}
	}

	public TreatmentService(TreatmentRepository treatmentRepository) {
		this.treatmentRepository = treatmentRepository;
	}


	public Page<Treatment> searchTreatments(
		int pageNumber,
		SortBy sortBy,
		boolean sortDescending,
		String searchToken,
		boolean activeOnly
	) {
		Sort sort = Sort.by(sortBy.asString());
		if (sortDescending) {
			sort = sort.descending();
		}
		PageRequest pageRequest = PageRequest.of(pageNumber, PAGE_SIZE, sort);
		if (activeOnly) {
			if (searchToken.isEmpty()) {
				return treatmentRepository.findByIsActiveTrue(pageRequest);
			} else {
				return treatmentRepository.findByNameContainsIgnoreCaseAndIsActiveTrue(searchToken, pageRequest);
			}
		} else {
			if (searchToken.isEmpty()) {
				return treatmentRepository.findAll(pageRequest);
			} else {
				return treatmentRepository.findByNameContainsIgnoreCase(searchToken, pageRequest);
			}
		}
	}

	public Treatment createTreatment(TreatmentRequestDTO dto) {
		Treatment treatment = new Treatment();
		treatment.setName(dto.name());
		treatment.setDescription(dto.description());
		treatment.setDurationMinutes(dto.durationMinutes());
		treatment.setPrice(dto.price());
		return treatmentRepository.save(treatment);
	}

	public Treatment updateTreatment(Integer id, TreatmentRequestDTO dto) {
		Treatment treatment = treatmentRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treatment not found"));
		treatment.setName(dto.name());
		treatment.setDescription(dto.description());
		treatment.setDurationMinutes(dto.durationMinutes());
		treatment.setPrice(dto.price());
		return treatmentRepository.save(treatment);
	}

	public Treatment toggleActive(Integer id) {
		Treatment treatment = treatmentRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treatment not found"));
		treatment.setIsActive(!treatment.getIsActive());
		return treatmentRepository.save(treatment);
	}
}
