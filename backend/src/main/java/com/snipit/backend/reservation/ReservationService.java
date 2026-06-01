package com.snipit.backend.reservation;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.treatment.TreatmentRepository;
import com.snipit.backend.user.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
import com.snipit.backend.user.User;
import java.util.Set;

@Service
public class ReservationService{
    private final ReservationMapper reservationMapper;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final TreatmentRepository treatmentRepository;

    public ReservationService(
        UserRepository userRepository,
        EmployeeRepository employeeRepository,
        TreatmentRepository treatmentRepository,
        ReservationMapper reservationMapper,
        ReservationRepository reservationRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.treatmentRepository = treatmentRepository;
        this.reservationMapper = reservationMapper;
        this.reservationRepository = reservationRepository;
    }

    public List<ReservationResponseDTO> findAll() {
        return reservationRepository.findAll()
            .stream()
            .map(reservationMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    public ReservationResponseDTO findById(Integer id) {
        Reservation r = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room did not found with id: " + id));
        return reservationMapper.toResponseDTO(r);
    }

     private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ReservationResponseDTO create(ReservationRequestDTO dto) {
        User user = getCurrentUser();

        Employee employee = employeeRepository.findById(dto.employeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        Set<Treatment> treatments = treatmentRepository.findAllById(dto.treatmentIds())
            .stream().collect(Collectors.toSet());

        Reservation r = reservationMapper.toEntity(dto);
        r.setUser(user);
        r.setEmployee(employee);
        r.setTreatments(treatments);

        return reservationMapper.toResponseDTO(reservationRepository.save(r));
    }
    
    public ReservationResponseDTO update(Integer id, ReservationRequestDTO req) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cannot find reservation with id: " + id));
        reservation.setReservationTime(req.reservationTime());
        reservation.setStatus(req.status());

        Reservation saved = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(saved);
    }

    public void delete(Integer id) {
        reservationRepository.deleteById(id);
    }
}

