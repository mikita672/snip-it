package com.snipit.backend.statistics.dto;

import java.math.BigDecimal;

public record MonthlyStatDTO(
    int month,
    long appointments,
    BigDecimal income
) {}
