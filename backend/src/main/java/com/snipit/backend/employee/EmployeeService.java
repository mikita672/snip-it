package com.snipit.backend.employee;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
	private final EmployeeRepository employeeRepository;

	public EmployeeService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	public List<Employee> getAll() {
		return employeeRepository.findAll();
	}
}
