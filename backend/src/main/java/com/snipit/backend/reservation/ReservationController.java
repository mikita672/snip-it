package com.snipit.backend.reservation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/api/reservation")
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
    public ResponseEntity<ReservationResponseDTO> create(@RequestBody @Valid ReservationRequestDTO room) {
        return new ResponseEntity<>(reservationService.create(room), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ReservationResponseDTO update(@PathVariable Integer id, @RequestBody @Valid ReservationRequestDTO room) {
        return reservationService.update(id, room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
