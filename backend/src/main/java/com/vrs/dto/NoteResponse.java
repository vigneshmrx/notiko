package com.vrs.dto;

import com.vrs.model.Note;

import java.time.Instant;

public record NoteResponse(String id, String content, String text,
                           Instant createdAt, Instant updatedAt) {
    public static NoteResponse from (Note n) {
        return new NoteResponse(n.getId(), n.getContent(), n.getText(),
                n.getCreatedAt(), n.getUpdatedAt());
    }
}
