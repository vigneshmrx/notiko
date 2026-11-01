package com.vrs.ctrl;

import com.vrs.dto.LoginRequest;
import com.vrs.dto.SignupRequest;
import com.vrs.dto.UserResponse;
import com.vrs.model.User;
import com.vrs.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class MainController {

    private final PasswordEncoder encoder;
    private final UserRepository users;

    public MainController(PasswordEncoder encoder, UserRepository users) {
        this.encoder = encoder;
        this.users = users;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public void signup(@RequestBody SignupRequest request) {
        String email = request.email().toLowerCase().trim();
        String username = request.username().trim();

        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        if (users.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        String hash = encoder.encode(request.password());
        users.save(new User(email, username, hash));
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest req) {
        String username = req.username().trim();

        Optional<User> oUser = users.findByUsername(username);
        if (oUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect username or password");
        } else {
            User user = oUser.get();

            if (!encoder.matches(req.password(), user.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect username or password");
            }

            return new UserResponse(user.getId(), user.getEmail(), user.getUsername());
        }
    }
}
