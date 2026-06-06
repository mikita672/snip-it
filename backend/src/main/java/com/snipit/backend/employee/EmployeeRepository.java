package com.snipit.backend.employee;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	@EntityGraph(attributePaths = {"treatments"})
	List<Employee> findAll();

	@Query("SELECT e.id FROM Employee e JOIN e.treatments t WHERE t.id IN :treatmentIds GROUP BY e.id HAVING COUNT(DISTINCT t.id) = :treatmentCount")
	List<Integer> findEmployeeIdsByAllTreatments(@Param("treatmentIds") List<Integer> treatmentIds, @Param("treatmentCount") long treatmentCount);

	@Query("SELECT DISTINCT e FROM Employee e LEFT JOIN FETCH e.schedules WHERE e.id IN :ids")
	List<Employee> findWithSchedulesByIds(@Param("ids") List<Integer> ids);
}
