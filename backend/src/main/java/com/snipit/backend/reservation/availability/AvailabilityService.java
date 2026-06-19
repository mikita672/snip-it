package com.snipit.backend.reservation.availability;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.reservation.Reservation;
import com.snipit.backend.reservation.ReservationStatus;
import com.snipit.backend.reservation.ReservationRepository;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.treatment.TreatmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    private static final int SLOT_INTERVAL_MINUTES = 30;
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final EmployeeRepository employeeRepository;
    private final ReservationRepository reservationRepository;
    private final TreatmentRepository treatmentRepository;

    public AvailabilityService(EmployeeRepository employeeRepository,
                               ReservationRepository reservationRepository,
                               TreatmentRepository treatmentRepository) {
        this.employeeRepository = employeeRepository;
        this.reservationRepository = reservationRepository;
        this.treatmentRepository = treatmentRepository;
    }

    public List<String> getAvailableSlots(List<Integer> treatmentIds, LocalDate date) {
        List<Integer> employeeIds = employeeRepository.findEmployeeIdsByAllTreatments(treatmentIds, treatmentIds.size());
        if (employeeIds.isEmpty()) {
            return List.of();
        }

        int sumDuration = sumDuration(treatmentIds);
        int dayOfWeek = date.getDayOfWeek().getValue();

        List<Employee> employees = employeeRepository.findByIdIn(employeeIds)
            .stream().distinct().toList();
        Map<Integer, List<Reservation>> reservationsByEmployee = fetchReservationsByEmployee(employeeIds, date);

        Set<LocalTime> availableSlots = new TreeSet<>();

        LocalTime now = LocalTime.now();
        boolean isToday = date.equals(LocalDate.now());

        for (Employee employee : employees) {
            employee.getSchedules().stream()
                    .filter(s -> s.getDayOfWeek().equals(dayOfWeek))
                    .findFirst()
                    .ifPresent(schedule -> {
                        List<Reservation> reservations = reservationsByEmployee.getOrDefault(employee.getId(), List.of());
                        for (LocalTime slot : generateSlots(schedule.getStartTime(), schedule.getEndTime(), sumDuration)) {
                            if (isToday && slot.isBefore(now)) {
                                continue;
                            }
                            if (!isBlocked(slot, sumDuration, reservations)) {
                                availableSlots.add(slot);
                            }
                        }
                    });
        }

        return availableSlots.stream()
                .map(t -> t.format(TIME_FORMAT))
                .toList();
    }

    public List<String> getAvailableDays(List<Integer> treatmentIds) {
        List<String> availableDays = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        for (int day = 0; day < 30; day++) {
            if (!getAvailableSlots(treatmentIds, currentDate).isEmpty()) {
                availableDays.add(currentDate.toString());
            }
            currentDate = currentDate.plusDays(1);
        }
        return availableDays;
    }

    public List<AvailableEmployeeDTO> getAvailableEmployees(List<Integer> treatmentIds, LocalDateTime dateTime) {
        List<Integer> employeeIds = employeeRepository.findEmployeeIdsByAllTreatments(treatmentIds, treatmentIds.size());
        if (employeeIds.isEmpty()) {
            return List.of();
        }

        int sumDuration = sumDuration(treatmentIds);
        int dayOfWeek = dateTime.getDayOfWeek().getValue();
        LocalTime requestedTime = dateTime.toLocalTime();

        List<Employee> employees = employeeRepository.findByIdIn(employeeIds);
        Map<Integer, List<Reservation>> reservationsByEmployee = fetchReservationsByEmployee(employeeIds, dateTime.toLocalDate());

        return employees.stream()
                .distinct()
                .filter(e -> e.getSchedules().stream()
                        .filter(s -> s.getDayOfWeek().equals(dayOfWeek))
                        .anyMatch(s -> !requestedTime.isBefore(s.getStartTime())
                                && !requestedTime.plusMinutes(sumDuration).isAfter(s.getEndTime())))
                .filter(e -> !isBlocked(requestedTime, sumDuration,
                        reservationsByEmployee.getOrDefault(e.getId(), List.of())))
                .map(e -> new AvailableEmployeeDTO(e.getId(), e.getFirstName(), e.getLastName(), e.getPosition()))
                .toList();
    }

    private Map<Integer, List<Reservation>> fetchReservationsByEmployee(List<Integer> employeeIds, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return reservationRepository.findByEmployeeIdsAndDate(employeeIds, startOfDay, endOfDay)
                .stream()
                .collect(Collectors.groupingBy(r -> r.getEmployee().getId()));
    }

    private int sumDuration(List<Integer> treatmentIds) {
        return treatmentRepository.findAllById(treatmentIds)
                .stream()
                .mapToInt(Treatment::getDurationMinutes)
                .sum();
    }

    private List<LocalTime> generateSlots(LocalTime start, LocalTime end, int durationMinutes) {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = start;
        while (!current.plusMinutes(durationMinutes).isAfter(end)) {
            slots.add(current);
            current = current.plusMinutes(SLOT_INTERVAL_MINUTES);
        }
        return slots;
    }

    private boolean isBlocked(LocalTime slot, int durationMinutes, List<Reservation> reservations) {
        int start1 = slot.toSecondOfDay() / 60;
        int end1 = start1 + durationMinutes;

        return reservations.stream()
                .filter(r -> r.getStatus() != ReservationStatus.Cancelled)
                .anyMatch(r -> {
                    int start2 = r.getReservationTime().toLocalTime().toSecondOfDay() / 60;
                    int rDuration = r.getSumDuration() != null ? r.getSumDuration() : 0;
                    int end2 = start2 + rDuration;
                    
                    return start1 < end2 && start2 < end1;
                });
    }
}