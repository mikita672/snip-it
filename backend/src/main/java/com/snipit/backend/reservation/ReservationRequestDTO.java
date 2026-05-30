package com.snipit.backend.reservation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.Set;

public class ReservationRequestDTO {
    @NotNull
    private Integer userId;

    @NotNull
    private Integer employeeId;

    @NotNull
    @Future
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime reservationTime;

    private String status;

    private Set<Integer> treatmentIds;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDateTime getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Integer> getTreatmentIds() {
        return treatmentIds;
    }

    public void setTreatmentIds(Set<Integer> treatmentIds) {
        this.treatmentIds = treatmentIds;
    }
}
