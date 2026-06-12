package com.snipit.backend.reservation;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;
import com.snipit.backend.reservation.dto.UserReservationsPageDTO;
import com.snipit.backend.user.User;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reservation")
@Tag(name = "Reservation", description = "Reservation management endpoints")
public class ReservationController {
    private final ReservationService reservationService;
    
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    
    @GetMapping
    public List<ReservationResponseDTO> getAll(){
        return reservationService.findAllReservations();
    }

    @GetMapping("/my-appointments")
    public UserReservationsPageDTO getMyAppointments(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return reservationService.getUserReservations(user, page, size);
    }

    @GetMapping("/{id}")
    public ReservationResponseDTO getById(@PathVariable Integer id) {
        return reservationService.findReservationById(id);
    }

    @PostMapping
    public ReservationResponseDTO create(@AuthenticationPrincipal User user, @RequestBody @Valid ReservationRequestDTO dto) {
        return reservationService.createReservation(dto, user);
    }

    @PatchMapping("/{id}")
    public ReservationResponseDTO updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Integer id, 
            @RequestParam String status) {
        return reservationService.updateReservationStatus(id, status, user);
    }
}
