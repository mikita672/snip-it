package com.snipit.backend.employee.dto;

public record ScheduleEntryDTO(
        Integer dayOfWeek,
        String startTime,
        String endTime
) {}
