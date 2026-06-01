package com.snipit.backend.treatment;

import com.snipit.backend.employee.Employee;
import com.snipit.backend.reservation.Reservation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "treatments")
@Getter
@Setter
@NoArgsConstructor
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_duration_minutes", nullable = false)
    private Integer minDurationMinutes;

    @Column(name = "max_duration_minutes", nullable = false)
    private Integer maxDurationMinutes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToMany(mappedBy = "treatments")
    private Set<Employee> employees = new HashSet<>();

    @ManyToMany(mappedBy = "treatments")
    private Set<Reservation> reservations = new HashSet<>();
}
