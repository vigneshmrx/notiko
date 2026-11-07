package com.vrs.dto;


import jakarta.validation.constraints.Size;

public record NoteRequest(
        @Size(max = 200_000) String content,
        @Size(max = 200_000) String text
) {}
