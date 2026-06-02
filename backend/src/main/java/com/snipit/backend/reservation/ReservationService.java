package com.snipit.backend.reservation;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.reservation.ResourceNotFoundException;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.treatment.TreatmentRepository;
import com.snipit.backend.user.User;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationMapper reservationMapper;
    private final ReservationRepository reservationRepository;
    private final EmployeeRepository employeeRepository;
    private final TreatmentRepository treatmentRepository;

    public ReservationService(
            EmployeeRepository employeeRepository,
            TreatmentRepository treatmentRepository,
            ReservationMapper reservationMapper,
            ReservationRepository reservationRepository) {
        this.employeeRepository = employeeRepository;
        this.treatmentRepository = treatmentRepository;
        this.reservationMapper = reservationMapper;
        this.reservationRepository = reservationRepository;
    }

    public List<ReservationResponseDTO> findAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ReservationResponseDTO findReservationById(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return reservationMapper.toResponseDTO(reservation);
    }

    public ReservationResponseDTO createReservation(ReservationRequestDTO dto, User user) {
        Employee employee = employeeRepository.findById(dto.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + dto.employeeId()));

        Set<Treatment> treatments = treatmentRepository.findAllById(dto.treatmentIds())
                .stream()
                .collect(Collectors.toSet());

        Reservation reservation = reservationMapper.toEntity(dto);
        reservation.setUser(user);
        reservation.setEmployee(employee);
        reservation.setTreatments(treatments);

        return reservationMapper.toResponseDTO(reservationRepository.save(reservation));
    }

    public ReservationResponseDTO updateReservationStatus(Integer id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));

        reservation.setStatus(status);

        Reservation saved = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(saved);
    }

    public void deleteReservation(Integer id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }
}