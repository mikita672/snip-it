package com.snipit.backend.statistics.dto;

import java.math.BigDecimal;
import java.util.List;

public record EmployeeStatsDTO(
    int employeeId,
    String employeeName,
    BigDecimal averageMonthlyIncome,
    long totalAppointments,
    BigDecimal totalIncome,
    List<MonthlyStatDTO> monthlyStats
) {}
