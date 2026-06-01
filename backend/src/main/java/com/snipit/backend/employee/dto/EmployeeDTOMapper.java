package com.snipit.backend.employee.dto;

import org.springframework.stereotype.Component;

import com.snipit.backend.employee.Employee;

@Component
public class EmployeeDTOMapper {
	public EmployeePreviewDTO previewDTOFromEntity(Employee employee) {
		return EmployeePreviewDTO.builder()
			.firstName(employee.getFirstName())
			.lastName(employee.getLastName())
			.position(employee.getPosition())
			.treatmentsPreview(new EmployeeTreatmentsPreviewDTO(
				employee.getTreatments().size(),
				employee.getTreatments().stream()
					.limit(3)
					.map(treatment -> treatment.getName())
					.toList()
			))
			.build();
	}
}
