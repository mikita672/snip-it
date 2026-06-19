package com.snipit.backend.employee;

import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.snipit.backend.employee.dto.EmployeeRequestDTO;
import com.snipit.backend.employee.dto.ScheduleEntryDTO;
import com.snipit.backend.treatment.TreatmentRepository;

@Service
public class EmployeeService {
	private final EmployeeRepository employeeRepository;
	private final TreatmentRepository treatmentRepository;

	public EmployeeService(EmployeeRepository employeeRepository, TreatmentRepository treatmentRepository) {
		this.employeeRepository = employeeRepository;
		this.treatmentRepository = treatmentRepository;
	}

	private void applySchedule(Employee employee, List<ScheduleEntryDTO> scheduleDTOs) {
		employee.getSchedules().clear();
		if (scheduleDTOs == null) {
			return;
		}
		for (ScheduleEntryDTO dto : scheduleDTOs) {
			EmployeeSchedule entry = new EmployeeSchedule();
			entry.setEmployee(employee);
			entry.setDayOfWeek(dto.dayOfWeek());
			entry.setStartTime(LocalTime.parse(dto.startTime()));
			entry.setEndTime(LocalTime.parse(dto.endTime()));
			employee.getSchedules().add(entry);
		}
	}

	public List<Employee> getAll() {
		return employeeRepository.findAll();
	}

	public List<Employee> getAllActive() {
		return employeeRepository.findAllByIsActiveTrue();
	}

	public Employee create(EmployeeRequestDTO dto) {
		Employee employee = new Employee();
		employee.setFirstName(dto.firstName());
		employee.setLastName(dto.lastName());
		employee.setPosition(dto.position());
		employee.setEmail(dto.email());
		employee.setPhone(dto.phone());
		employee.setIsActive(true);
		if (dto.treatmentIds() != null && !dto.treatmentIds().isEmpty()) {
			employee.setTreatments(treatmentRepository.findAllById(dto.treatmentIds()));
		}
		applySchedule(employee, dto.schedule());
		return employeeRepository.save(employee);
	}

	public Employee update(Integer id, EmployeeRequestDTO dto) {
		Employee employee = employeeRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
		employee.setFirstName(dto.firstName());
		employee.setLastName(dto.lastName());
		employee.setPosition(dto.position());
		employee.setEmail(dto.email());
		employee.setPhone(dto.phone());
		if (dto.treatmentIds() != null) {
			employee.setTreatments(treatmentRepository.findAllById(dto.treatmentIds()));
		}
		applySchedule(employee, dto.schedule());
		return employeeRepository.save(employee);
	}

	public Employee toggleActive(Integer id) {
		Employee employee = employeeRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
		employee.setIsActive(!employee.getIsActive());
		return employeeRepository.save(employee);
	}
}
