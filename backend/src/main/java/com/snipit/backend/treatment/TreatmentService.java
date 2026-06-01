package com.snipit.backend.treatment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
				case DURATION -> "minDurationMinutes";
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
		String searchToken
	) {
		Sort sort = Sort.by(sortBy.asString());
		if (sortDescending) {
			sort = sort.descending();
		}
		PageRequest pageRequest = PageRequest.of(pageNumber, PAGE_SIZE, sort);
		if (searchToken.isEmpty()) {
			return treatmentRepository.findAll(pageRequest);
		} else {
			return treatmentRepository.findByNameStartingWithIgnoreCase(searchToken, pageRequest);
		}
	}
}
