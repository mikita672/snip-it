package com.snipit.backend.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
public record ReservationRequestDTO(
    @NotNull Integer employeeId,
    @NotNull @Future @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime reservationTime,
    String status,
    Set<Integer> treatmentIds
) {}