package com.snipit.backend.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

	@Query("SELECT r FROM Reservation r JOIN FETCH r.employee WHERE r.employee.id IN :employeeIds AND r.reservationTime >= :startOfDay AND r.reservationTime < :endOfDay")
	List<Reservation> findByEmployeeIdsAndDate(@Param("employeeIds") List<Integer> employeeIds,
	                                           @Param("startOfDay") LocalDateTime startOfDay,
	                                           @Param("endOfDay") LocalDateTime endOfDay);
}
