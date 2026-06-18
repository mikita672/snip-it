package com.snipit.backend.config;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.employee.EmployeeRepository;
import com.snipit.backend.employee.EmployeeSchedule;
import com.snipit.backend.reservation.Reservation;
import com.snipit.backend.reservation.ReservationRepository;
import com.snipit.backend.treatment.Treatment;
import com.snipit.backend.treatment.TreatmentRepository;
import com.snipit.backend.user.User;
import com.snipit.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            TreatmentRepository treatmentRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            ReservationRepository reservationRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (treatmentRepository.count() == 0 && employeeRepository.count() == 0) {
                Treatment t1 = new Treatment();
                t1.setName("Men's Haircut");
                t1.setDescription("Classic men's haircut");
                t1.setDurationMinutes(30);
                t1.setPrice(new BigDecimal("25.00"));
                t1.setIsActive(true);

                Treatment t2 = new Treatment();
                t2.setName("Women's Haircut");
                t2.setDescription("Classic women's haircut");
                t2.setDurationMinutes(45);
                t2.setPrice(new BigDecimal("45.00"));
                t2.setIsActive(true);

                Treatment t3 = new Treatment();
                t3.setName("Beard Trim");
                t3.setDescription("Professional beard grooming");
                t3.setDurationMinutes(15);
                t3.setPrice(new BigDecimal("15.00"));
                t3.setIsActive(true);

                Treatment t4 = new Treatment();
                t4.setName("Hair Coloring");
                t4.setDescription("Full hair coloring service");
                t4.setDurationMinutes(90);
                t4.setPrice(new BigDecimal("85.00"));
                t4.setIsActive(true);

                Treatment t5 = new Treatment();
                t5.setName("Highlights");
                t5.setDescription("Foil highlights");
                t5.setDurationMinutes(90);
                t5.setPrice(new BigDecimal("110.00"));
                t5.setIsActive(true);

                Treatment t6 = new Treatment();
                t6.setName("Blowout");
                t6.setDescription("Wash, blowdry and style");
                t6.setDurationMinutes(30);
                t6.setPrice(new BigDecimal("35.00"));
                t6.setIsActive(true);

                Treatment t7 = new Treatment();
                t7.setName("Kids Haircut");
                t7.setDescription("Haircut for children under 12");
                t7.setDurationMinutes(20);
                t7.setPrice(new BigDecimal("20.00"));
                t7.setIsActive(true);

                Treatment t8 = new Treatment();
                t8.setName("Bridal Styling");
                t8.setDescription("Complete bridal hair styling");
                t8.setDurationMinutes(60);
                t8.setPrice(new BigDecimal("150.00"));
                t8.setIsActive(true);

                treatmentRepository.saveAll(List.of(t1, t2, t3, t4, t5, t6, t7, t8));

                Employee e1 = new Employee();
                e1.setFirstName("John");
                e1.setLastName("Doe");
                e1.setPosition("Senior Stylist");
                e1.setEmail("john.doe@snipit.com");
                e1.setPhone("+1234567890");
                e1.setTreatments(List.of(t1, t3, t7));
                addSchedule(e1, LocalTime.of(9, 0), LocalTime.of(17, 0));

                Employee e2 = new Employee();
                e2.setFirstName("Jane");
                e2.setLastName("Smith");
                e2.setPosition("Master Colorist");
                e2.setEmail("jane.smith@snipit.com");
                e2.setPhone("+1987654321");
                e2.setTreatments(List.of(t2, t4, t5, t6, t8));
                addSchedule(e2, LocalTime.of(8, 0), LocalTime.of(16, 0));

                Employee e3 = new Employee();
                e3.setFirstName("Mike");
                e3.setLastName("Johnson");
                e3.setPosition("Barber");
                e3.setEmail("mike.j@snipit.com");
                e3.setPhone("+1122334455");
                e3.setTreatments(List.of(t1, t3, t7));
                addSchedule(e3, LocalTime.of(10, 0), LocalTime.of(18, 0));

                Employee e4 = new Employee();
                e4.setFirstName("Emily");
                e4.setLastName("Davis");
                e4.setPosition("Junior Stylist");
                e4.setEmail("emily.d@snipit.com");
                e4.setPhone("+1555666777");
                e4.setTreatments(List.of(t1, t2, t6, t7));
                addSchedule(e4, LocalTime.of(9, 0), LocalTime.of(17, 0));

                employeeRepository.saveAll(List.of(e1, e2, e3, e4));

                User user = new User();
                user.setEmail("client@example.com");
                user.setFirstName("Demo");
                user.setLastName("Client");
                user.setPasswordHash(passwordEncoder.encode("password"));
                userRepository.save(user);

                User admin = new User();
                admin.setEmail("admin@admin.com");
                admin.setFirstName("Demo");
                admin.setLastName("Admin");
                admin.setIsAdmin(true);
                admin.setPasswordHash(passwordEncoder.encode("admin"));
                userRepository.save(admin);

                String[] statuses = { "Pending", "Confirmed", "Cancelled", "Completed" };
                List<Employee> allEmployees = List.of(e1, e2, e3, e4);
                List<Treatment> allTreatments = List.of(t1, t2, t3, t4, t5, t6, t7, t8);
                java.util.Random random = new java.util.Random();

                for (int i = 0; i < 40; i++) {
                    Reservation r = new Reservation();
                    r.setUser(user);

                    Employee randomEmployee = allEmployees.get(random.nextInt(allEmployees.size()));
                    r.setEmployee(randomEmployee);

                    LocalDateTime randomTime = LocalDateTime.now()
                            .plusDays(random.nextInt(61) - 30)
                            .withHour(9 + random.nextInt(8))
                            .withMinute(random.nextBoolean() ? 0 : 30)
                            .withSecond(0).withNano(0);
                    r.setReservationTime(randomTime);

                    r.setStatus(statuses[random.nextInt(statuses.length)]);

                    int treatmentCount = 1 + random.nextInt(2);
                    Set<Treatment> selectedTreatments = new java.util.HashSet<>();
                    int duration = 0;
                    java.math.BigDecimal totalPrice = java.math.BigDecimal.ZERO;
                    for (int j = 0; j < treatmentCount; j++) {
                        Treatment rt = allTreatments.get(random.nextInt(allTreatments.size()));
                        selectedTreatments.add(rt);
                        duration += rt.getDurationMinutes();
                        totalPrice = totalPrice.add(rt.getPrice());
                    }
                    r.setTreatments(selectedTreatments);
                    r.setSumDuration(duration);
                    r.setTotalPrice(totalPrice);

                    reservationRepository.save(r);
                }
            }
        };
    }

    private void addSchedule(Employee employee, LocalTime startTime, LocalTime endTime) {
        for (int i = 1; i <= 5; i++) {
            EmployeeSchedule schedule = new EmployeeSchedule();
            schedule.setEmployee(employee);
            schedule.setDayOfWeek(i);
            schedule.setStartTime(startTime);
            schedule.setEndTime(endTime);
            employee.getSchedules().add(schedule);
        }
    }
}
