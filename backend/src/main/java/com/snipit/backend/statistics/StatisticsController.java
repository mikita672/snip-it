package com.snipit.backend.statistics;

import com.snipit.backend.statistics.dto.EmployeeStatsDTO;
import com.snipit.backend.statistics.dto.GeneralStatsDTO;
import com.snipit.backend.statistics.dto.TreatmentStatsDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/general")
    public GeneralStatsDTO getGeneralStats(
            @RequestParam(defaultValue = "0") int year) {
        if (year == 0) {
            year = LocalDateTime.now().getYear();
        }
        return statisticsService.getGeneralStats(year);
    }

    @GetMapping("/employees")
    public List<EmployeeStatsDTO> getEmployeeStats(
            @RequestParam(defaultValue = "0") int year) {
        if (year == 0) {
            year = LocalDateTime.now().getYear();
        }
        return statisticsService.getEmployeeStats(year);
    }

    @GetMapping("/treatments")
    public List<TreatmentStatsDTO> getTreatmentStats(
            @RequestParam(defaultValue = "0") int year) {
        if (year == 0) {
            year = LocalDateTime.now().getYear();
        }
        return statisticsService.getTreatmentStats(year);
    }
}
