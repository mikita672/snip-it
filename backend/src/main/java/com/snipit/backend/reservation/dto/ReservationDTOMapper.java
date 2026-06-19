package com.snipit.backend.reservation.dto;

import com.snipit.backend.reservation.Reservation;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.reservation.ReservationStatus;

@Component
public class ReservationDTOMapper {
    public ReservationResponseDTO toResponseDTO(Reservation reservation) {
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .userId(reservation.getUser().getId())
                .employeeId(reservation.getEmployee().getId())
                .reservationTime(reservation.getReservationTime())
                .status(reservation.getStatus().name())
                .createdAt(reservation.getCreatedAt())
                .treatmentIds(reservation.getTreatments().stream()
                        .map(Treatment::getId)
                        .collect(Collectors.toSet()))
                .sumDuration(reservation.getSumDuration())
                .totalPrice(reservation.getTotalPrice())
                .build();
    }

    public UserReservationPreviewDTO toUserReservationPreviewDTO(Reservation reservation) {
        return UserReservationPreviewDTO.builder()
                .id(reservation.getId())
                .reservationTime(reservation.getReservationTime())
                .treatments(reservation.getTreatments().stream().map(Treatment::getName).toList())
                .employeeName(reservation.getEmployee().getFirstName() + " " + reservation.getEmployee().getLastName())
                .durationMinutes(reservation.getSumDuration())
                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus().name())
                .build();
    }

    public AdminReservationPreviewDTO toAdminReservationPreviewDTO(Reservation reservation) {
        return AdminReservationPreviewDTO.builder()
                .id(reservation.getId())
                .reservationTime(reservation.getReservationTime())
                .treatments(reservation.getTreatments().stream().map(Treatment::getName).toList())
                .employeeName(reservation.getEmployee().getFirstName() + " " + reservation.getEmployee().getLastName())
                .durationMinutes(reservation.getSumDuration())
                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus().name())
                .userFullName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName())
                .userEmail(reservation.getUser().getEmail())
                .build();
    }

    public Reservation toEntity(ReservationRequestDTO dto) {
        ReservationStatus status = ReservationStatus.Pending;
        if (dto.status() != null) {
            status = ReservationStatus.valueOf(dto.status().toLowerCase().substring(0, 1).toUpperCase() + dto.status().toLowerCase().substring(1));
        }
        return Reservation.builder()
                .reservationTime(dto.reservationTime())
                .status(status)
                .build();
    }
}
