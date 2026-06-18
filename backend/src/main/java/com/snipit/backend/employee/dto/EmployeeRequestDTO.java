package com.snipit.backend.employee.dto;

import java.util.List;

public record EmployeeRequestDTO(
	String firstName,
	String lastName,
	String position,
	String email,
	String phone,
	List<Integer> treatmentIds,
	List<ScheduleEntryDTO> schedule
) {}
