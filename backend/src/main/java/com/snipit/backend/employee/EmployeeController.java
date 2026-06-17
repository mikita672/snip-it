package com.snipit.backend.employee;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.employee.dto.EmployeeDTO;
import com.snipit.backend.employee.dto.EmployeeDTOMapper;
import com.snipit.backend.employee.dto.EmployeePreviewDTO;
import com.snipit.backend.employee.dto.EmployeeRequestDTO;

import java.util.List;


@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {

	private final EmployeeService employeeService;
	private final EmployeeDTOMapper employeeDTOMapper;

	public EmployeeController(EmployeeService employeeService, EmployeeDTOMapper employeeDTOMapper) {
		this.employeeService = employeeService;
		this.employeeDTOMapper = employeeDTOMapper;
	}

	@GetMapping
	public List<EmployeeDTO> getEmployees() {
		return employeeService.getAll()
			.stream()
			.map(employeeDTOMapper::employeeDTOFromEntity)
			.toList();
	}

	@GetMapping("/preview")
	public List<EmployeePreviewDTO> getEmployeesPreview() {
		return employeeService.getAllActive()
			.stream()
			.map(employeeDTOMapper::previewDTOFromEntity)
			.toList();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public EmployeeDTO createEmployee(@RequestBody EmployeeRequestDTO dto) {
		return employeeDTOMapper.employeeDTOFromEntity(employeeService.create(dto));
	}

	@PutMapping("/{id}")
	public EmployeeDTO updateEmployee(
		@PathVariable Integer id,
		@RequestBody EmployeeRequestDTO dto
	) {
		return employeeDTOMapper.employeeDTOFromEntity(employeeService.update(id, dto));
	}

	@PatchMapping("/{id}/toggle-active")
	public EmployeeDTO toggleActive(@PathVariable Integer id) {
		return employeeDTOMapper.employeeDTOFromEntity(employeeService.toggleActive(id));
	}
}
