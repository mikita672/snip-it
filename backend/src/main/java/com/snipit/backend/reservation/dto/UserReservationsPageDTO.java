package com.snipit.backend.reservation.dto;

import java.util.List;

public record UserReservationsPageDTO(
    List<UserReservationPreviewDTO> reservations,
    int totalPages,
    long totalElements,
    int currentPage
) {}
