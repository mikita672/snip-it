package com.snipit.backend.employee;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.employee.dto.EmployeeDTOMapper;
import com.snipit.backend.employee.dto.EmployeePreviewDTO;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
	
	private final EmployeeService employeeService;
	private final EmployeeDTOMapper employeeDTOMapper;

	public EmployeeController(EmployeeService employeeService, EmployeeDTOMapper employeeDTOMapper) {
		this.employeeService = employeeService;
		this.employeeDTOMapper = employeeDTOMapper;
	}

	@GetMapping("/preview")
	public List<EmployeePreviewDTO> getEmployeesPreview() {
		return employeeService.getAll()
			.stream()
			.map(employeeDTOMapper::previewDTOFromEntity)
			.toList();
	}
	
}
