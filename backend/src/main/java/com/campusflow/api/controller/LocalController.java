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

    @PutMapping("/{id}")
    public Local atualizar(@PathVariable Long id, @RequestBody Local dados) {
        var local = localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local", id));
        local.setNome(dados.getNome());
        if (dados.getBloco() != null)     local.setBloco(dados.getBloco());
        if (dados.getAndar() != null)     local.setAndar(dados.getAndar());
        if (dados.getDescricao() != null) local.setDescricao(dados.getDescricao());
        return localRepository.save(local);
    }

    @DeleteMapping("/{id}")
    public void desativar(@PathVariable Long id) {
        var local = localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local", id));
        local.setAtivo(false);
        localRepository.save(local);
    }
}
