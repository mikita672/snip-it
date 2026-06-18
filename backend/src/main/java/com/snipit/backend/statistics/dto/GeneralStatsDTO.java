package com.snipit.backend.statistics.dto;

import java.math.BigDecimal;
import java.util.List;

public record GeneralStatsDTO(
    List<MonthlyStatDTO> monthlyStats,
    List<Integer> availableYears,
    BigDecimal averageMonthlyIncome,
    BigDecimal totalIncome,
    long totalAppointments
) {}
