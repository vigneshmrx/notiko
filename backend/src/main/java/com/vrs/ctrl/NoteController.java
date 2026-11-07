package com.vrs.ctrl;

import com.vrs.dto.NoteRequest;
import com.vrs.dto.NoteResponse;
import com.vrs.model.Note;
import com.vrs.repo.NoteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepo;

    public NoteController(NoteRepository noteRepo) {
        this.noteRepo = noteRepo;
    }

    @GetMapping("/{id}")
    public NoteResponse getNote(@PathVariable String id, Authentication auth) {
        Optional<Note> oNote = noteRepo.findByIdAndUserId(id, (String) auth.getPrincipal());
        if (oNote.isPresent()) {
            return NoteResponse.from(oNote.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
        }
    }

    @GetMapping
    public List<NoteResponse> list(Authentication auth) {
        return noteRepo.findByUserIdOrderByUpdatedAtDesc((String) auth.getPrincipal())
                .stream().map(n -> NoteResponse.from(n)).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponse create(@Valid @RequestBody NoteRequest req, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return NoteResponse.from(noteRepo.save(new Note(userId, req.content(), req.text())));
    }

    @PutMapping("{id}")
    public NoteResponse update(@PathVariable String id,
                               @Valid @RequestBody NoteRequest req,
                               Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Optional<Note> oNote = noteRepo.findByIdAndUserId(id, userId);
        if (oNote.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
        } else {
            Note note = oNote.get();
            note.update(req.content(), req.text());
            return NoteResponse.from(noteRepo.save(note));
        }
    }

}
