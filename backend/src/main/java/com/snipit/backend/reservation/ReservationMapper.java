package com.snipit.backend.reservation;

import com.snipit.backend.reservation.dto.AdminReservationPreviewDTO;
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
        return UserReservationPreviewDTO.builder()
                .id(reservation.getId())
                .reservationTime(reservation.getReservationTime())
                .treatments(reservation.getTreatments().stream().map(Treatment::getName).toList())
                .employeeName(reservation.getEmployee().getFirstName() + " " + reservation.getEmployee().getLastName())
                .durationMinutes(reservation.getSumDuration())
                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus())
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
                .status(reservation.getStatus())
                .userFullName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName())
                .userEmail(reservation.getUser().getEmail())
                .build();
    }

    public Reservation toEntity(ReservationRequestDTO dto) {
        return Reservation.builder()
                .reservationTime(dto.reservationTime())
                .status(dto.status())
                .build();
    }
}