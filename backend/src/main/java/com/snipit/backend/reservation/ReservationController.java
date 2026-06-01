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
        return reservationService.findAll();
    }

    @GetMapping("/{id}")
    public ReservationResponseDTO getById(@PathVariable Integer id) {
        return reservationService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> create(@RequestBody @Valid ReservationRequestDTO r) {
        return new ResponseEntity<>(reservationService.create(r), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ReservationResponseDTO update(@PathVariable Integer id, @RequestBody @Valid ReservationRequestDTO r) {
        return reservationService.update(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
