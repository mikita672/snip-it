package com.snipit.backend.statistics;

import com.snipit.backend.reservation.Reservation;
import com.snipit.backend.reservation.ReservationRepository;
import com.snipit.backend.reservation.ReservationStatus;
import com.snipit.backend.statistics.dto.EmployeeStatsDTO;
import com.snipit.backend.statistics.dto.GeneralStatsDTO;
import com.snipit.backend.statistics.dto.MonthlyStatDTO;
import com.snipit.backend.statistics.dto.TreatmentStatsDTO;
import com.snipit.backend.treatment.Treatment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

@Service
public class StatisticsService {

    private final ReservationRepository reservationRepository;

    public StatisticsService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public GeneralStatsDTO getGeneralStats(int year) {
        List<Reservation> completed = getCompletedForYear(year);

        Map<Integer, Long> countByMonth = new HashMap<>();
        Map<Integer, BigDecimal> incomeByMonth = new HashMap<>();
        for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
            countByMonth.put(monthIndex, 0L);
            incomeByMonth.put(monthIndex, BigDecimal.ZERO);
        }

        for (Reservation reservation : completed) {
            int month = reservation.getReservationTime().getMonthValue();
            countByMonth.merge(month, 1L, Long::sum);
            incomeByMonth.merge(month, reservation.getTotalPrice(), BigDecimal::add);
        }

        List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
        for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
            monthlyStats.add(new MonthlyStatDTO(monthIndex, countByMonth.get(monthIndex), incomeByMonth.get(monthIndex)));
        }

        BigDecimal totalIncome = incomeByMonth.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalAppointments = completed.size();

        BigDecimal averageMonthlyIncome;
        if (totalAppointments == 0) {
            averageMonthlyIncome = BigDecimal.ZERO;
        } else {
            long monthsWithData = countByMonth.values().stream().filter(count -> count > 0).count();
            if (monthsWithData == 0) {
                averageMonthlyIncome = BigDecimal.ZERO;
            } else {
                averageMonthlyIncome = totalIncome.divide(
                        BigDecimal.valueOf(monthsWithData), 2, RoundingMode.HALF_UP);
            }
        }

        List<Integer> availableYears = getAvailableYears();

        return new GeneralStatsDTO(
                monthlyStats,
                availableYears,
                averageMonthlyIncome,
                totalIncome,
                totalAppointments
        );
    }

    @Transactional(readOnly = true)
    public List<EmployeeStatsDTO> getEmployeeStats(int year) {
        List<Reservation> completed = getCompletedForYear(year);

        Map<Integer, String> employeeNames = new HashMap<>();
        Map<Integer, Map<Integer, Long>> employeeMonthCount = new HashMap<>();
        Map<Integer, Map<Integer, BigDecimal>> employeeMonthIncome = new HashMap<>();

        for (Reservation reservation : completed) {
            int employeeId = reservation.getEmployee().getId();
            String empName = reservation.getEmployee().getFirstName() + " " + reservation.getEmployee().getLastName();
            employeeNames.put(employeeId, empName);

            employeeMonthCount.computeIfAbsent(employeeId, key -> {
                Map<Integer, Long> monthMap = new HashMap<>();
                for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                    monthMap.put(monthIndex, 0L);
                }
                return monthMap;
            });
            employeeMonthIncome.computeIfAbsent(employeeId, key -> {
                Map<Integer, BigDecimal> monthMap = new HashMap<>();
                for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                    monthMap.put(monthIndex, BigDecimal.ZERO);
                }
                return monthMap;
            });

            int month = reservation.getReservationTime().getMonthValue();
            employeeMonthCount.get(employeeId).merge(month, 1L, Long::sum);
            employeeMonthIncome.get(employeeId).merge(month, reservation.getTotalPrice(), BigDecimal::add);
        }

        List<EmployeeStatsDTO> result = new ArrayList<>();
        for (int employeeId : employeeNames.keySet()) {
            Map<Integer, Long> monthCount = employeeMonthCount.get(employeeId);
            Map<Integer, BigDecimal> monthIncome = employeeMonthIncome.get(employeeId);

            List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
            for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                monthlyStats.add(new MonthlyStatDTO(monthIndex, monthCount.get(monthIndex), monthIncome.get(monthIndex)));
            }

            BigDecimal totalIncome = monthIncome.values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            long totalAppointments = monthCount.values().stream()
                    .mapToLong(Long::longValue).sum();

            long monthsWithData = monthCount.values().stream().filter(count -> count > 0).count();
            BigDecimal avgMonthlyIncome;
            if (monthsWithData == 0) {
                avgMonthlyIncome = BigDecimal.ZERO;
            } else {
                avgMonthlyIncome = totalIncome.divide(
                        BigDecimal.valueOf(monthsWithData), 2, RoundingMode.HALF_UP);
            }

            result.add(new EmployeeStatsDTO(
                    employeeId,
                    employeeNames.get(employeeId),
                    avgMonthlyIncome,
                    totalAppointments,
                    totalIncome,
                    monthlyStats
            ));
        }

        result.sort(Comparator.comparing(EmployeeStatsDTO::averageMonthlyIncome).reversed());

        return result;
    }

    @Transactional(readOnly = true)
    public List<TreatmentStatsDTO> getTreatmentStats(int year) {
        List<Reservation> completed = getCompletedForYear(year);

        Map<Integer, String> treatmentNames = new HashMap<>();
        Map<Integer, Map<Integer, Long>> treatmentMonthCount = new HashMap<>();
        Map<Integer, Map<Integer, BigDecimal>> treatmentMonthIncome = new HashMap<>();

        for (Reservation reservation : completed) {
            int month = reservation.getReservationTime().getMonthValue();

            for (Treatment treatment : reservation.getTreatments()) {
                int treatmentId = treatment.getId();
                treatmentNames.put(treatmentId, treatment.getName());

                treatmentMonthCount.computeIfAbsent(treatmentId, key -> {
                    Map<Integer, Long> monthMap = new HashMap<>();
                    for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                        monthMap.put(monthIndex, 0L);
                    }
                    return monthMap;
                });
                treatmentMonthIncome.computeIfAbsent(treatmentId, key -> {
                    Map<Integer, BigDecimal> monthMap = new HashMap<>();
                    for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                        monthMap.put(monthIndex, BigDecimal.ZERO);
                    }
                    return monthMap;
                });

                treatmentMonthCount.get(treatmentId).merge(month, 1L, Long::sum);
                treatmentMonthIncome.get(treatmentId).merge(month, treatment.getPrice(), BigDecimal::add);
            }
        }

        List<TreatmentStatsDTO> result = new ArrayList<>();
        for (int treatmentId : treatmentNames.keySet()) {
            Map<Integer, Long> monthCount = treatmentMonthCount.get(treatmentId);
            Map<Integer, BigDecimal> monthIncome = treatmentMonthIncome.get(treatmentId);

            List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
            for (int monthIndex = 1; monthIndex <= 12; monthIndex++) {
                monthlyStats.add(new MonthlyStatDTO(monthIndex, monthCount.get(monthIndex), monthIncome.get(monthIndex)));
            }

            long totalAppointments = monthCount.values().stream()
                    .mapToLong(Long::longValue).sum();
            BigDecimal totalIncome = monthIncome.values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(new TreatmentStatsDTO(
                    treatmentId,
                    treatmentNames.get(treatmentId),
                    totalAppointments,
                    totalIncome,
                    monthlyStats
            ));
        }

        result.sort(Comparator.comparingLong(TreatmentStatsDTO::totalAppointments).reversed());

        return result;
    }

    private List<Reservation> getCompletedForYear(int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(year + 1, 1, 1, 0, 0);

        return reservationRepository.findByStatusAndDate(
                ReservationStatus.Completed, start, end);
    }

    private List<Integer> getAvailableYears() {
        List<Reservation> allCompleted = reservationRepository.findByStatus(ReservationStatus.Completed);

        TreeSet<Integer> years = new TreeSet<>();
        for (Reservation reservation : allCompleted) {
            years.add(reservation.getReservationTime().getYear());
        }

        if (years.isEmpty()) {
            years.add(LocalDateTime.now().getYear());
        }

        return new ArrayList<>(years);
    }
}
