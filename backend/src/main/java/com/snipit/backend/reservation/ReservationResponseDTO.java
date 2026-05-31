package com.snipit.backend.reservation;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.Set;

public record ReservationResponseDTO(
    Integer id,
    Integer userId,
    Integer employeeId,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime reservationTime,
    String status,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime createdAt,
    Set<Integer> treatmentIds
) {}