package com.snipit.backend.statistics;

import com.snipit.backend.reservation.Reservation;
import com.snipit.backend.reservation.ReservationRepository;
import com.snipit.backend.statistics.dto.EmployeeStatsDTO;
import com.snipit.backend.statistics.dto.GeneralStatsDTO;
import com.snipit.backend.statistics.dto.MonthlyStatDTO;
import com.snipit.backend.statistics.dto.TreatmentStatsDTO;
import com.snipit.backend.treatment.Treatment;
import org.springframework.data.jpa.domain.Specification;
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
        for (int m = 1; m <= 12; m++) {
            countByMonth.put(m, 0L);
            incomeByMonth.put(m, BigDecimal.ZERO);
        }

        for (Reservation r : completed) {
            int month = r.getReservationTime().getMonthValue();
            countByMonth.merge(month, 1L, Long::sum);
            incomeByMonth.merge(month, r.getTotalPrice(), BigDecimal::add);
        }

        List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthlyStats.add(new MonthlyStatDTO(m, countByMonth.get(m), incomeByMonth.get(m)));
        }

        BigDecimal totalIncome = incomeByMonth.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalAppointments = completed.size();

        BigDecimal averageMonthlyIncome;
        if (totalAppointments == 0) {
            averageMonthlyIncome = BigDecimal.ZERO;
        } else {
            long monthsWithData = countByMonth.values().stream().filter(c -> c > 0).count();
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

        for (Reservation r : completed) {
            int empId = r.getEmployee().getId();
            String empName = r.getEmployee().getFirstName() + " " + r.getEmployee().getLastName();
            employeeNames.put(empId, empName);

            employeeMonthCount.computeIfAbsent(empId, k -> {
                Map<Integer, Long> m = new HashMap<>();
                for (int i = 1; i <= 12; i++) {
                    m.put(i, 0L);
                }
                return m;
            });
            employeeMonthIncome.computeIfAbsent(empId, k -> {
                Map<Integer, BigDecimal> m = new HashMap<>();
                for (int i = 1; i <= 12; i++) {
                    m.put(i, BigDecimal.ZERO);
                }
                return m;
            });

            int month = r.getReservationTime().getMonthValue();
            employeeMonthCount.get(empId).merge(month, 1L, Long::sum);
            employeeMonthIncome.get(empId).merge(month, r.getTotalPrice(), BigDecimal::add);
        }

        List<EmployeeStatsDTO> result = new ArrayList<>();
        for (int empId : employeeNames.keySet()) {
            Map<Integer, Long> monthCount = employeeMonthCount.get(empId);
            Map<Integer, BigDecimal> monthIncome = employeeMonthIncome.get(empId);

            List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
            for (int m = 1; m <= 12; m++) {
                monthlyStats.add(new MonthlyStatDTO(m, monthCount.get(m), monthIncome.get(m)));
            }

            BigDecimal totalIncome = monthIncome.values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            long totalAppointments = monthCount.values().stream()
                    .mapToLong(Long::longValue).sum();

            long monthsWithData = monthCount.values().stream().filter(c -> c > 0).count();
            BigDecimal avgMonthlyIncome;
            if (monthsWithData == 0) {
                avgMonthlyIncome = BigDecimal.ZERO;
            } else {
                avgMonthlyIncome = totalIncome.divide(
                        BigDecimal.valueOf(monthsWithData), 2, RoundingMode.HALF_UP);
            }

            result.add(new EmployeeStatsDTO(
                    empId,
                    employeeNames.get(empId),
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

        for (Reservation r : completed) {
            int month = r.getReservationTime().getMonthValue();
            int treatmentCount = r.getTreatments().size();

            for (Treatment t : r.getTreatments()) {
                int tId = t.getId();
                treatmentNames.put(tId, t.getName());

                treatmentMonthCount.computeIfAbsent(tId, k -> {
                    Map<Integer, Long> m = new HashMap<>();
                    for (int i = 1; i <= 12; i++) {
                        m.put(i, 0L);
                    }
                    return m;
                });
                treatmentMonthIncome.computeIfAbsent(tId, k -> {
                    Map<Integer, BigDecimal> m = new HashMap<>();
                    for (int i = 1; i <= 12; i++) {
                        m.put(i, BigDecimal.ZERO);
                    }
                    return m;
                });

                treatmentMonthCount.get(tId).merge(month, 1L, Long::sum);
                treatmentMonthIncome.get(tId).merge(month, t.getPrice(), BigDecimal::add);
            }
        }

        List<TreatmentStatsDTO> result = new ArrayList<>();
        for (int tId : treatmentNames.keySet()) {
            Map<Integer, Long> monthCount = treatmentMonthCount.get(tId);
            Map<Integer, BigDecimal> monthIncome = treatmentMonthIncome.get(tId);

            List<MonthlyStatDTO> monthlyStats = new ArrayList<>();
            for (int m = 1; m <= 12; m++) {
                monthlyStats.add(new MonthlyStatDTO(m, monthCount.get(m), monthIncome.get(m)));
            }

            long totalAppointments = monthCount.values().stream()
                    .mapToLong(Long::longValue).sum();
            BigDecimal totalIncome = monthIncome.values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(new TreatmentStatsDTO(
                    tId,
                    treatmentNames.get(tId),
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

        Specification<Reservation> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), "Completed"),
                cb.greaterThanOrEqualTo(root.get("reservationTime"), start),
                cb.lessThan(root.get("reservationTime"), end)
        );

        return reservationRepository.findAll(spec);
    }

    private List<Integer> getAvailableYears() {
        Specification<Reservation> spec = (root, query, cb) ->
                cb.equal(root.get("status"), "Completed");

        List<Reservation> allCompleted = reservationRepository.findAll(spec);

        TreeSet<Integer> years = new TreeSet<>();
        for (Reservation r : allCompleted) {
            years.add(r.getReservationTime().getYear());
        }

        if (years.isEmpty()) {
            years.add(LocalDateTime.now().getYear());
        }

        return new ArrayList<>(years);
    }
}
