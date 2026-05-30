package com.campusflow.api.controller;

import com.campusflow.api.dto.request.CriarEquipamentoRequest;
import com.campusflow.api.dto.response.EquipamentoResponse;
import com.campusflow.api.entity.Equipamento;
import com.campusflow.api.exception.ResourceNotFoundException;
import com.campusflow.api.repository.EquipamentoRepository;
import com.campusflow.api.repository.LocalRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/equipamentos")
@RequiredArgsConstructor
@Tag(name = "Equipamentos", description = "Inventário de equipamentos")
public class EquipamentoController {

    private final EquipamentoRepository equipamentoRepository;
    private final LocalRepository localRepository;

    @GetMapping
    public List<EquipamentoResponse> listar(@RequestParam(required = false) Long localId) {
        List<Equipamento> lista = localId != null
                ? equipamentoRepository.findAllByLocalIdAndOperacionalTrue(localId)
                : equipamentoRepository.findAll();
        return lista.stream().map(this::toResponse).toList();
    }

    @GetMapping("/defeito")
    public List<EquipamentoResponse> comDefeito() {
        return equipamentoRepository.findAllByOperacionalFalse()
                .stream().map(this::toResponse).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipamentoResponse criar(@Valid @RequestBody CriarEquipamentoRequest request) {
        var builder = Equipamento.builder()
                .nome(request.nome())
                .numeroPatrimonio(request.numeroPatrimonio())
                .modelo(request.modelo())
                .fabricante(request.fabricante());

        if (request.localId() != null) {
            var local = localRepository.findById(request.localId())
                    .orElseThrow(() -> new ResourceNotFoundException("Local", request.localId()));
            builder.local(local);
        }

        return toResponse(equipamentoRepository.save(builder.build()));
    }

    @PatchMapping("/{id}/operacional")
    public EquipamentoResponse atualizarOperacional(
            @PathVariable Long id,
            @RequestParam boolean operacional) {
        var eq = equipamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento", id));
        eq.setOperacional(operacional);
        return toResponse(equipamentoRepository.save(eq));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        var eq = equipamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipamento", id));
        equipamentoRepository.delete(eq);
    }

    // ── Mapper privado ────────────────────────────────────────
    private EquipamentoResponse toResponse(Equipamento e) {
        EquipamentoResponse.LocalResumo localResumo = null;
        if (e.getLocal() != null) {
            localResumo = new EquipamentoResponse.LocalResumo(
                    e.getLocal().getId(),
                    e.getLocal().getNome(),
                    e.getLocal().getBloco()
            );
        }
        return new EquipamentoResponse(
                e.getId(),
                e.getNome(),
                e.getNumeroPatrimonio(),
                e.getModelo(),
                e.getFabricante(),
                e.isOperacional(),
                localResumo
        );
    }
}
