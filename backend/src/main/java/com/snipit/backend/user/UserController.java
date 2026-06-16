package com.snipit.backend.user;

import com.snipit.backend.user.dto.UpdateProfileRequestDTO;
import com.snipit.backend.user.dto.UserProfileDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@Tag(name = "User", description = "User management endpoints")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public UserProfileDTO getProfile(@AuthenticationPrincipal User user) {
        return new UserProfileDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getIsAdmin()
        );
    }

    @PutMapping("/profile")
    public UserProfileDTO updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateProfileRequestDTO dto) {
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        User saved = userRepository.save(user);
        return new UserProfileDTO(
            saved.getId(),
            saved.getEmail(),
            saved.getFirstName(),
            saved.getLastName(),
            saved.getPhone(),
            saved.getIsAdmin()
        );
    }
}
