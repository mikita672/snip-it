package com.snipit.backend.reservation;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.treatment.Treatment;
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

    public ReservationResponseDTO create(ReservationRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + dto.getEmployeeId()));
        Set<Treatment> treatments = treatmentRepository.findAllById(dto.getTreatmentIds())
            .stream().collect(Collectors.toSet());

        Reservation r = reservationMapper.toEntity(dto, user, employee, treatments);
        Reservation saved = reservationRepository.save(r);
        return reservationMapper.toResponseDTO(saved);
    }
    
    public ReservationResponseDTO update(Integer id, ReservationRequestDTO req) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cannot find reservation with id: " + id));

        User user = userRepository.findById(req.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + req.getUserId()));

        Employee employee = employeeRepository.findById(req.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + req.getEmployeeId()));

        Set<Treatment> treatments = treatmentRepository.findAllById(req.getTreatmentIds())
            .stream()
            .collect(Collectors.toSet());

        reservation.setUser(user);
        reservation.setEmployee(employee);
        reservation.setReservationTime(req.getReservationTime());
        reservation.setStatus(req.getStatus());
        reservation.setTreatments(treatments);

        Reservation saved = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(saved);
    }

    public void delete(Integer id) {
        reservationRepository.deleteById(id);
    }
}

