package com.snipit.backend.availability;

public record AvailableEmployeeDTO(
        Integer id,
        String firstName,
        String lastName,
        String position
) {}