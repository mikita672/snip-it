package com.snipit.backend.reservation.availability;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.reservation.Reservation;
import com.snipit.backend.reservation.ReservationRepository;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.treatment.TreatmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<String> getAvailableSlots(List<Integer> treatmentIds, LocalDate date) {
        List<Integer> employeeIds = employeeRepository.findEmployeeIdsByAllTreatments(treatmentIds, treatmentIds.size());
        if (employeeIds.isEmpty()) return List.of();

        int sumDuration = sumDuration(treatmentIds);
        int dayOfWeek = date.getDayOfWeek().getValue();

        List<Employee> employees = employeeRepository.findWithSchedulesByIds(employeeIds);
        Map<Integer, List<Reservation>> reservationsByEmployee = fetchReservationsByEmployee(employeeIds, date);

        Set<LocalTime> availableSlots = new TreeSet<>();

        LocalTime now = LocalTime.now();
        boolean isToday = date.equals(LocalDate.now());

        for (Employee employee : employees.stream().distinct().toList()) {
            employee.getSchedules().stream()
                    .filter(s -> s.getDayOfWeek().equals(dayOfWeek))
                    .findFirst()
                    .ifPresent(schedule -> {
                        List<Reservation> reservations = reservationsByEmployee.getOrDefault(employee.getId(), List.of());
                        for (LocalTime slot : generateSlots(schedule.getStartTime(), schedule.getEndTime(), sumDuration)) {
                            if (isToday && slot.isBefore(now)) continue;
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

    @Transactional(readOnly = true)
    public List<String> getAvailableDays(List<Integer> treatmentIds, LocalDate startDate, LocalDate endDate) {
        List<String> availableDays = new ArrayList<>();
        LocalDate currentDate = startDate;
        int maxDays = 30;
        int count = 0;
        while (!currentDate.isAfter(endDate) && count < maxDays) {
            if (!getAvailableSlots(treatmentIds, currentDate).isEmpty()) {
                availableDays.add(currentDate.toString());
            }
            currentDate = currentDate.plusDays(1);
            count++;
        }
        return availableDays;
    }

    @Transactional(readOnly = true)
    public List<AvailableEmployeeDTO> getAvailableEmployees(List<Integer> treatmentIds, LocalDateTime dateTime) {
        List<Integer> employeeIds = employeeRepository.findEmployeeIdsByAllTreatments(treatmentIds, treatmentIds.size());
        if (employeeIds.isEmpty()) return List.of();

        int sumDuration = sumDuration(treatmentIds);
        int dayOfWeek = dateTime.getDayOfWeek().getValue();
        LocalTime requestedTime = dateTime.toLocalTime();

        List<Employee> employees = employeeRepository.findWithSchedulesByIds(employeeIds);
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
        LocalTime slotEnd = slot.plusMinutes(durationMinutes);
        return reservations.stream().anyMatch(r -> {
            LocalTime resStart = r.getReservationTime().toLocalTime();
            LocalTime resEnd = resStart.plusMinutes(r.getSumDuration() != null ? r.getSumDuration() : 0);
            return slot.isBefore(resEnd) && slotEnd.isAfter(resStart);
        });
    }
}