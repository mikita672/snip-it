package com.snipit.backend.reservation.availability;

public record AvailableEmployeeDTO(
        Integer id,
        String firstName,
        String lastName,
        String position
) {}