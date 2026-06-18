package com.snipit.backend.statistics.dto;

import java.math.BigDecimal;
import java.util.List;

public record TreatmentStatsDTO(
    int treatmentId,
    String treatmentName,
    long totalAppointments,
    BigDecimal totalIncome,
    List<MonthlyStatDTO> monthlyStats
) {}
