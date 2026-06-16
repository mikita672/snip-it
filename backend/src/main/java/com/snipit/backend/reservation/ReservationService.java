package com.snipit.backend.reservation;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;
import com.snipit.backend.reservation.dto.UserReservationPreviewDTO;
import com.snipit.backend.reservation.dto.UserReservationsPageDTO;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.exceptions.ResourceNotFoundException;
import com.snipit.backend.treatment.TreatmentRepository;
import com.snipit.backend.user.User;
import com.snipit.backend.user.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.snipit.backend.reservation.availability.AvailabilityService;
import com.snipit.backend.reservation.availability.AvailableEmployeeDTO;

@Service
public class ReservationService {
    private final int REPUTATION_CANCELED_PENALTY = 20;
    private final int REPUTATION_COMPLETED_BONUS = 10;
    private final int REPUTATION_AUTO_CONFIRM_TRESHOLD = 80;

    private final ReservationMapper reservationMapper;
    private final ReservationRepository reservationRepository;
    private final EmployeeRepository employeeRepository;
    private final TreatmentRepository treatmentRepository;
    private final AvailabilityService availabilityService;
    private final UserRepository userRepository;

    public ReservationService(
            EmployeeRepository employeeRepository,
            TreatmentRepository treatmentRepository,
            ReservationMapper reservationMapper,
            ReservationRepository reservationRepository,
            AvailabilityService availabilityService,
            UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.treatmentRepository = treatmentRepository;
        this.reservationMapper = reservationMapper;
        this.reservationRepository = reservationRepository;
        this.availabilityService = availabilityService;
        this.userRepository = userRepository;
    }

    public List<ReservationResponseDTO> findAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    public ReservationResponseDTO findReservationById(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return reservationMapper.toResponseDTO(reservation);
    }

    @Transactional(readOnly = true)
    public UserReservationsPageDTO getUserReservations(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Reservation> reservationPage = reservationRepository.findByUserOrderByReservationTimeDesc(user, pageable);
        
        List<UserReservationPreviewDTO> dtos = reservationPage.getContent()
                .stream()
                .map(reservationMapper::toUserReservationPreviewDTO)
                .toList();
                
        return new UserReservationsPageDTO(
            dtos,
            reservationPage.getTotalPages(),
            reservationPage.getTotalElements(),
            reservationPage.getNumber()
        );
    }

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO dto, User user) {
        Employee employee = employeeRepository.findById(dto.employeeId())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + dto.employeeId()));

        List<AvailableEmployeeDTO> availableEmployees = availabilityService.getAvailableEmployees(
            new ArrayList<>(dto.treatmentIds()), dto.reservationTime()
        );

        boolean isAvailable = availableEmployees
            .stream()
            .anyMatch(e -> e.id()
            .equals(dto.employeeId()));

        if (!isAvailable) {
            throw new IllegalArgumentException("The selected time slot is not available for this employee.");
        }

        Set<Treatment> treatments = new HashSet<>(treatmentRepository.findAllById(dto.treatmentIds()));
        int sumDuration = treatments
            .stream()
            .mapToInt(Treatment::getDurationMinutes)
            .sum();

        Reservation reservation = reservationMapper.toEntity(dto);
        reservation.setUser(user);
        reservation.setEmployee(employee);
        reservation.setTreatments(treatments);
        reservation.setSumDuration(sumDuration);

        if (user.getReputation() >= REPUTATION_AUTO_CONFIRM_TRESHOLD) {
            reservation.setStatus("Confirmed");
        } else {
            reservation.setStatus("Pending");
        }

        return reservationMapper.toResponseDTO(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponseDTO updateReservationStatus(Integer id, String status, User user) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        reservation.setStatus(status);

        Reservation saved = reservationRepository.save(reservation);

        switch (status) {
            case "Cancelled" -> {
                int reputation = Math.max(0, user.getReputation() - REPUTATION_CANCELED_PENALTY);
                user.setReputation(reputation);
                userRepository.save(user);
            }
            case "Completed" -> {
                int reputation = Math.min(100, user.getReputation() + REPUTATION_COMPLETED_BONUS);
                user.setReputation(reputation);
                userRepository.save(user);
            }
            default -> {}
        }

        return reservationMapper.toResponseDTO(saved);
    }
}
