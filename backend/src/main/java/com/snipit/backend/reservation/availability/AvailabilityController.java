package com.snipit.backend.reservation.availability;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public List<String> getAvailableSlots(
            @RequestParam List<Integer> treatmentIds,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return availabilityService.getAvailableSlots(treatmentIds, date);
    }

    @GetMapping("/days")
    public List<String> getAvailableDays(@RequestParam List<Integer> treatmentIds) {
        return availabilityService.getAvailableDays(treatmentIds);
    }

    @GetMapping("/employees")
    public List<AvailableEmployeeDTO> getAvailableEmployees(
            @RequestParam List<Integer> treatmentIds,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        return availabilityService.getAvailableEmployees(treatmentIds, dateTime);
    }
}