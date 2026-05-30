package com.snipit.backend.reservation;
import java.util.stream.Collectors;
import java.util.Set;
import com.snipit.backend.employee.Employee;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.user.User;

public class ReservationMapper {
    public ReservationResponseDTO ReservationResponseDTO(Reservation r){
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(r.getId());
        dto.setUserId(r.getUser().getId());
        dto.setEmployeeId(r.getEmployee().getId());
        dto.setReservationTime(r.getReservationTime());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setTreatmentIds(r.getTreatments() != null
            ? r.getTreatments().stream().map(Treatment::getId).collect(Collectors.toSet()) : null);
        return dto;
    }

    public Reservation toEntity(ReservationRequestDTO dto, User user, Employee employee, Set<Treatment> treatments){
        Reservation r = new Reservation();
        r.setUser(user);
        r.setEmployee(employee);
        r.setReservationTime(dto.getReservationTime());
        r.setStatus(dto.getStatus());
        if (treatments != null) r.setTreatments(treatments);
        return r;
    }
}
