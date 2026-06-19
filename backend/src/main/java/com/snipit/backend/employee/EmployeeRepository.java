package com.snipit.backend.employee;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	@EntityGraph(attributePaths = {"treatments"})
	List<Employee> findAll();

	@EntityGraph(attributePaths = {"treatments"})
	List<Employee> findAllByIsActiveTrue();

	@Query("SELECT e.id FROM Employee e JOIN e.treatments t WHERE t.id IN :treatmentIds AND e.isActive = true GROUP BY e.id HAVING COUNT(DISTINCT t.id) = :treatmentCount")
	List<Integer> findEmployeeIdsByAllTreatments(@Param("treatmentIds") List<Integer> treatmentIds, @Param("treatmentCount") long treatmentCount);

	@EntityGraph(attributePaths = {"schedules"})
	List<Employee> findByIdIn(List<Integer> ids);
}
