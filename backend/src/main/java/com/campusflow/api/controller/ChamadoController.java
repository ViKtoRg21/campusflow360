package com.campusflow.api.controller;

import com.campusflow.api.dto.request.AtualizarStatusRequest;
import com.campusflow.api.dto.request.CriarChamadoRequest;
import com.campusflow.api.dto.response.ChamadoResponse;
import com.campusflow.api.enums.StatusChamado;
import com.campusflow.api.service.ChamadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chamados")
@RequiredArgsConstructor
@Tag(name = "Chamados", description = "Gestão de chamados acadêmicos e de infraestrutura")
public class ChamadoController {

    private final ChamadoService chamadoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Abrir novo chamado")
    public ChamadoResponse criar(
            @Valid @RequestBody CriarChamadoRequest request,
            // TODO: extrair do JWT; por ora recebe como header para facilitar testes
            @RequestHeader("X-User-Id") Long solicitanteId) {
        return chamadoService.criar(request, solicitanteId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar chamado por ID")
    public ChamadoResponse buscarPorId(@PathVariable Long id) {
        return chamadoService.buscarPorId(id);
    }

    @GetMapping
    @Operation(summary = "Listar todos os chamados (paginado)")
    public Page<ChamadoResponse> listarTodos(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @RequestParam(required = false) StatusChamado status,
            @RequestParam(required = false) String q) {

        if (q != null && !q.isBlank()) {
            return chamadoService.buscar(q, pageable);
        }
        if (status != null) {
            return chamadoService.listarPorStatus(status, pageable);
        }
        return chamadoService.listarTodos(pageable);
    }

    @GetMapping("/meus")
    @Operation(summary = "Chamados abertos pelo usuário logado")
    public Page<ChamadoResponse> meusChamados(
            @RequestHeader("X-User-Id") Long solicitanteId,
            @PageableDefault(size = 20) Pageable pageable) {
        return chamadoService.listarPorSolicitante(solicitanteId, pageable);
    }

    @GetMapping("/minha-fila")
    @Operation(summary = "Fila do técnico logado")
    public Page<ChamadoResponse> minhaFila(
            @RequestHeader("X-User-Id") Long tecnicoId,
            @PageableDefault(size = 20) Pageable pageable) {
        return chamadoService.listarPorTecnico(tecnicoId, pageable);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status / atribuir técnico")
    public ChamadoResponse atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusRequest request,
            @RequestHeader("X-User-Id") Long autorId) {
        return chamadoService.atualizarStatus(id, request, autorId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir chamado (somente ADMIN)")
    public void deletar(@PathVariable Long id) {
        chamadoService.deletar(id);
    }
}
