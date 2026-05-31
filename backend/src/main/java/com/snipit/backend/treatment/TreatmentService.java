package com.snipit.backend.treatment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.snipit.backend.treatment.dto.TreatmentDTOMapper;
import com.snipit.backend.treatment.dto.TreatmentPreviewDTO;

@Service
public class TreatmentService {
	private final TreatmentRepository treatmentRepository;
	private final TreatmentDTOMapper treatmentDTOMapper;
	private final static int PAGE_SIZE = 6;

	public TreatmentService(TreatmentRepository treatmentRepository, TreatmentDTOMapper treatmentDTOMapper) {
		this.treatmentRepository = treatmentRepository;
		this.treatmentDTOMapper = treatmentDTOMapper;
	}


	public List<TreatmentPreviewDTO> getTreatmentPreviews(int pageNumber, String sortBy, boolean sortDescending) {
		Sort sort = Sort.by(sortBy);
		if (sortDescending) {
			sort = sort.descending();
		}
		PageRequest pageRequest = PageRequest.of(pageNumber, PAGE_SIZE, sort);
		Page<Treatment> page = treatmentRepository.findAll(pageRequest);
		return page.stream()
			.map(treatmentDTOMapper::previewDTOFromEntity)
			.toList();
	}
}
