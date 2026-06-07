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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

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

        List<Employee> employees = employeeRepository.findWithSchedulesByIds(employeeIds);

        int sumDuration = treatmentRepository.findAllById(treatmentIds)
                .stream()
                .mapToInt(Treatment::getMinDurationMinutes)
                .sum();

        int dayOfWeek = date.getDayOfWeek().getValue();
        Set<LocalTime> availableSlots = new TreeSet<>();

        for (Employee employee : employees) {
            employee.getSchedules().stream()
                    .filter(s -> s.getDayOfWeek().equals(dayOfWeek))
                    .findFirst()
                    .ifPresent(schedule -> {
                        LocalDateTime startOfDay = date.atStartOfDay();
                        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
                        List<Reservation> reservations = reservationRepository.findByEmployeeIdAndDate(
                                employee.getId(), startOfDay, endOfDay);

                        for (LocalTime slot : generateSlots(schedule.getStartTime(), schedule.getEndTime(), sumDuration)) {
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

    private List<LocalTime> generateSlots(LocalTime start, LocalTime end, int durationMinutes) {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = start;
        while (!current.plusMinutes(durationMinutes).isAfter(end)) {
            slots.add(current);
            current = current.plusMinutes(SLOT_INTERVAL_MINUTES);
        }
        return slots;
    }

    @Transactional(readOnly = true)
    public List<AvailableEmployeeDTO> getAvailableEmployees(List<Integer> treatmentIds, LocalDateTime dateTime) {
        List<Integer> employeeIds = employeeRepository.findEmployeeIdsByAllTreatments(treatmentIds, treatmentIds.size());
        if (employeeIds.isEmpty()) return List.of();

        List<Employee> employees = employeeRepository.findWithSchedulesByIds(employeeIds);

        int sumDuration = treatmentRepository.findAllById(treatmentIds)
                .stream()
                .mapToInt(Treatment::getMinDurationMinutes)
                .sum();

        int dayOfWeek = dateTime.getDayOfWeek().getValue();
        LocalTime requestedTime = dateTime.toLocalTime();
        LocalDate date = dateTime.toLocalDate();

        List<AvailableEmployeeDTO> result = new ArrayList<>();

        for (Employee employee : employees) {
            boolean coversSlot = employee.getSchedules().stream()
                    .filter(s -> s.getDayOfWeek().equals(dayOfWeek))
                    .anyMatch(s -> !requestedTime.isBefore(s.getStartTime())
                            && !requestedTime.plusMinutes(sumDuration).isAfter(s.getEndTime()));

            if (!coversSlot) continue;

            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            List<Reservation> reservations = reservationRepository.findByEmployeeIdAndDate(
                    employee.getId(), startOfDay, endOfDay);

            if (!isBlocked(requestedTime, sumDuration, reservations)) {
                result.add(new AvailableEmployeeDTO(
                        employee.getId(),
                        employee.getFirstName(),
                        employee.getLastName(),
                        employee.getPosition()));
            }
        }

        return result;
    }

    private boolean isBlocked(LocalTime slot, int durationMinutes, List<Reservation> reservations) {
        LocalTime slotEnd = slot.plusMinutes(durationMinutes);
        for (Reservation r : reservations) {
            LocalTime resStart = r.getReservationTime().toLocalTime();
            int resDuration = r.getSumDuration() != null ? r.getSumDuration() : 0;
            LocalTime resEnd = resStart.plusMinutes(resDuration);
            if (slot.isBefore(resEnd) && slotEnd.isAfter(resStart)) {
                return true;
            }
        }
        return false;
    }
}