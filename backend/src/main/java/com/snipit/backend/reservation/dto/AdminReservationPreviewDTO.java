package com.snipit.backend.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminReservationPreviewDTO(
    Integer id,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime reservationTime,
    List<String> treatments,
    String employeeName,
    Integer durationMinutes,
    BigDecimal totalPrice,
    String status,
    String userFullName,
    String userEmail
) {}
