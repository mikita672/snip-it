package com.snipit.backend.reservation.dto;

import java.util.List;

public record AdminReservationsPageDTO(
    List<AdminReservationPreviewDTO> reservations,
    int totalPages,
    long totalElements,
    int currentPage
) {}
