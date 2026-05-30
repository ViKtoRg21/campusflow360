package com.campusflow.api.controller;

import com.campusflow.api.entity.Local;
import com.campusflow.api.exception.ResourceNotFoundException;
import com.campusflow.api.repository.LocalRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locais")
@RequiredArgsConstructor
@Tag(name = "Locais", description = "Salas, laboratórios e ambientes")
public class LocalController {

    private final LocalRepository localRepository;

    @GetMapping
    public List<Local> listar() {
        return localRepository.findAllByAtivoTrue();
    }

    @GetMapping("/{id}")
    public Local buscarPorId(@PathVariable Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local", id));
    }

    @PostMapping
    public Local criar(@RequestBody Local local) {
        return localRepository.save(local);
    }
}
