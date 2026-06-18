package com.snipit.backend.user;

import com.snipit.backend.user.dto.ChangePasswordRequestDTO;
import com.snipit.backend.user.dto.UpdateProfileRequestDTO;
import com.snipit.backend.user.dto.UserProfileDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@Tag(name = "User", description = "User management endpoints")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserProfileDTO getProfile(@AuthenticationPrincipal User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getIsAdmin());
    }

    @PutMapping("/profile")
    public UserProfileDTO updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateProfileRequestDTO dto) {
        User saved = userService.updateUser(user, dto.firstName(), dto.lastName(), dto.phone());
        return new UserProfileDTO(
                saved.getId(),
                saved.getEmail(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getPhone(),
                saved.getIsAdmin());
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid ChangePasswordRequestDTO dto) {
        if (!dto.newPassword().equals(dto.confirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        userService.changePassword(user, dto.currentPassword(), dto.newPassword());
        return ResponseEntity.noContent().build();
    }
}