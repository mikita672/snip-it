package com.snipit.backend.reservation;

import com.snipit.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

	@Query("SELECT r FROM Reservation r JOIN FETCH r.employee WHERE r.employee.id IN :employeeIds AND r.reservationTime >= :startOfDay AND r.reservationTime < :endOfDay")
	List<Reservation> findByEmployeeIdsAndDate(@Param("employeeIds") List<Integer> employeeIds,
	                                           @Param("startOfDay") LocalDateTime startOfDay,
	                                           @Param("endOfDay") LocalDateTime endOfDay);

	Page<Reservation> findByUserOrderByReservationTimeDesc(User user, Pageable pageable);
}
