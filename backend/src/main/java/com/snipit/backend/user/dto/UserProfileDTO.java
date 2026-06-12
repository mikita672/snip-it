package com.snipit.backend.user.dto;

public record UserProfileDTO(
    Integer id,
    String email,
    String firstName,
    String lastName,
    String phone
) {}
