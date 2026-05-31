package com.snipit.backend.reservation;

import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import java.util.Set;
import com.snipit.backend.employee.Employee;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.user.User;

@Component
public class ReservationMapper {

    public ReservationResponseDTO toResponseDTO(Reservation r) {
        return new ReservationResponseDTO(
            r.getId(),
            r.getUser().getId(),
            r.getEmployee().getId(),
            r.getReservationTime(),
            r.getStatus(),
            r.getCreatedAt(),
            r.getTreatments() != null
                ? r.getTreatments().stream()
                    .map(Treatment::getId)
                    .collect(Collectors.toSet())
                : Set.of()
        );
    }

    public Reservation toEntity(ReservationRequestDTO dto, User user, Employee employee, Set<Treatment> treatments) {
        Reservation r = new Reservation();
        r.setUser(user);
        r.setEmployee(employee);
        r.setReservationTime(dto.reservationTime());
        r.setStatus(dto.status());
        if (treatments != null) r.setTreatments(treatments);
        return r;
    }
}