package com.vrs.repo;

import com.vrs.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends MongoRepository<Note, String> {
//    Optional<Note> findById(String id);
    List<Note> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<Note> findByIdAndUserId(String id, String userId);
}
