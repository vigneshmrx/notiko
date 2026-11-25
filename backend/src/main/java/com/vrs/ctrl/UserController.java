package com.vrs.ctrl;

import com.vrs.dto.ChangePwdRequest;
import com.vrs.dto.UserResponse;
import com.vrs.model.User;
import com.vrs.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public UserController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        System.out.println("Calling me");
        String userId = (String) authentication.getPrincipal();
        User user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername());
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePwdRequest req, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        System.out.println("Inside the flow");

        Optional<User> oUser = userId != null ? users.findById(userId) : Optional.empty();
        if (oUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        } else {
            System.out.println("Got the user");
            User user = oUser.get();

            if (!encoder.matches(req.oldPassword(), user.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
            }
            System.out.println("Password matches");

            user.setPasswordHash(encoder.encode(req.newPassword()));
            users.save(user);
        }
    }
}
