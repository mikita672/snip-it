package com.snipit.backend.reservation;
import com.snipit.backend.reservation.dto.ReservationRequestDTO;
import com.snipit.backend.reservation.dto.ReservationResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

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

    @GetMapping("/{id}")
    public ReservationResponseDTO getById(@PathVariable Integer id) {
        return reservationService.findReservationById(id);
    }

    @PostMapping
    public ReservationResponseDTO create(@AuthenticationPrincipal User user, @RequestBody @Valid ReservationRequestDTO dto) {
        return reservationService.createReservation(dto, user);
    }

    @PatchMapping("/{id}")
    public ReservationResponseDTO updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return reservationService.updateReservationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
