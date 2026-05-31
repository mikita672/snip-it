package com.snipit.backend.reservation;

import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import com.snipit.backend.treatment.Treatment;

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
            r.getTreatments().stream()
                .map(Treatment::getId)
                .collect(Collectors.toSet())
        );
    }

    public Reservation toEntity(ReservationRequestDTO dto) {
        Reservation r = new Reservation();
        r.setReservationTime(dto.reservationTime());
        r.setStatus(dto.status());
        return r;
    }
}