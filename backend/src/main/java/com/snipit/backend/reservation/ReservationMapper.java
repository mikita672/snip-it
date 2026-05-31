package com.snipit.backend.reservation;

import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import com.snipit.backend.treatment.Treatment;

@Component
public class ReservationMapper {

    public ReservationResponseDTO toResponseDTO(Reservation r) {
        return ReservationResponseDTO.builder()
            .id(r.getId())
            .userId(r.getUser().getId())
            .employeeId(r.getEmployee().getId())
            .reservationTime(r.getReservationTime())
            .status(r.getStatus())
            .createdAt(r.getCreatedAt())
            .treatmentIds(r.getTreatments().stream()
                .map(Treatment::getId)
                .collect(Collectors.toSet()))
            .build();
    }

    public Reservation toEntity(ReservationRequestDTO dto) {
        return Reservation.builder()
            .reservationTime(dto.reservationTime())
            .status(dto.status())
            .build();
    }
}