package com.snipit.backend.reservation;

import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;
import com.snipit.backend.reservation.dto.UserReservationPreviewDTO;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import com.snipit.backend.treatment.Treatment;

@Component
public class ReservationMapper {
    public ReservationResponseDTO toResponseDTO(Reservation reservation) {
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .userId(reservation.getUser().getId())
                .employeeId(reservation.getEmployee().getId())
                .reservationTime(reservation.getReservationTime())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .treatmentIds(reservation.getTreatments().stream()
                        .map(Treatment::getId)
                        .collect(Collectors.toSet()))
                .sumDuration(reservation.getSumDuration())
                .totalPrice(reservation.getTotalPrice())
                .build();
    }

    public UserReservationPreviewDTO toUserReservationPreviewDTO(Reservation reservation) {
        return new UserReservationPreviewDTO(
                reservation.getId(),
                reservation.getReservationTime(),
                reservation.getTreatments().stream().map(Treatment::getName).toList(),
                reservation.getEmployee().getFirstName() + " " + reservation.getEmployee().getLastName(),
                reservation.getSumDuration(),
                reservation.getTotalPrice(),
                reservation.getStatus());
    }

    public Reservation toEntity(ReservationRequestDTO dto) {
        return Reservation.builder()
                .reservationTime(dto.reservationTime())
                .status(dto.status())
                .build();
    }
}