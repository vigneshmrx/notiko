package com.vrs.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

//@Entity
//@Table(name = "users")
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String username;

    private String passwordHash;

    private LocalDateTime createdAt = LocalDateTime.now();

    protected User() {}

    public User(String email, String username, String passwordHash) {
        this.email = email.toLowerCase().trim();
        this.username = username.trim();
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
}
