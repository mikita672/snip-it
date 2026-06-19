package com.snipit.backend.reservation;

import com.snipit.backend.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

	@Query("SELECT r FROM Reservation r JOIN FETCH r.employee " +
		   "WHERE r.employee.id IN :employeeIds " +
		   "AND r.reservationTime >= :startOfDay " +
		   "AND r.reservationTime < :endOfDay")
	List<Reservation> findByEmployeeIdsAndDate(
			List<Integer> employeeIds,
			LocalDateTime startOfDay,
			LocalDateTime endOfDay
	);

	@Query("SELECT DISTINCT r FROM Reservation r " +
		   "LEFT JOIN r.treatments t " +
		   "WHERE r.user = :user " +
		   "AND r.status = :status " +
		   "AND (:search IS NULL OR LOWER(r.employee.firstName) LIKE :search OR " +
		   "LOWER(r.employee.lastName) LIKE :search OR LOWER(t.name) LIKE :search)")
	Page<Reservation> findByUserAndStatusWithSearch(
			User user,
			ReservationStatus status,
			String search,
			Pageable pageable
	);

	@Query("SELECT DISTINCT r FROM Reservation r " +
		   "LEFT JOIN r.treatments t " +
		   "WHERE r.user = :user " +
		   "AND (:search IS NULL OR LOWER(r.employee.firstName) LIKE :search OR " +
		   "LOWER(r.employee.lastName) LIKE :search OR LOWER(t.name) LIKE :search)")
	Page<Reservation> findByUserWithSearch(
			User user,
			String search,
			Pageable pageable
	);

	@Query("SELECT DISTINCT r FROM Reservation r " +
		   "LEFT JOIN r.treatments t " +
		   "WHERE r.status = :status " +
		   "AND (:search IS NULL OR LOWER(r.employee.firstName) LIKE :search OR " +
		   "LOWER(r.employee.lastName) LIKE :search OR LOWER(r.user.firstName) LIKE :search OR " +
		   "LOWER(r.user.lastName) LIKE :search OR LOWER(r.user.email) LIKE :search OR " +
		   "LOWER(t.name) LIKE :search)")
	Page<Reservation> findAllByStatusWithSearch(
			ReservationStatus status,
			String search,
			Pageable pageable
	);

	@Query("SELECT DISTINCT r FROM Reservation r " +
		   "LEFT JOIN r.treatments t " +
		   "WHERE (:search IS NULL OR LOWER(r.employee.firstName) LIKE :search OR " +
		   "LOWER(r.employee.lastName) LIKE :search OR LOWER(r.user.firstName) LIKE :search OR " +
		   "LOWER(r.user.lastName) LIKE :search OR LOWER(r.user.email) LIKE :search OR " +
		   "LOWER(t.name) LIKE :search)")
	Page<Reservation> findAllWithSearch(
			String search,
			Pageable pageable
	);

	@Query("SELECT r FROM Reservation r " +
		   "WHERE r.status = :status " +
		   "AND r.reservationTime >= :startOfDay " +
		   "AND r.reservationTime < :endOfDay")
	List<Reservation> findByStatusAndDate(
			ReservationStatus status,
			LocalDateTime startOfDay,
			LocalDateTime endOfDay
	);

	List<Reservation> findByStatus(ReservationStatus status);

	@Query("SELECT DISTINCT YEAR(r.reservationTime) FROM Reservation r WHERE r.status = :status")
	List<Integer> findDistinctYearsByStatus(ReservationStatus status);

	long countByUserAndStatusIn(User user, Collection<ReservationStatus> statuses);
}
