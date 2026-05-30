package com.campusflow.api.service;

import com.campusflow.api.dto.request.AtualizarStatusRequest;
import com.campusflow.api.dto.request.CriarChamadoRequest;
import com.campusflow.api.dto.response.ChamadoResponse;
import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.StatusChamado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChamadoService {

    ChamadoResponse criar(CriarChamadoRequest request, Long solicitanteId);

    ChamadoResponse buscarPorId(Long id);

    Page<ChamadoResponse> listarTodos(Pageable pageable);

    Page<ChamadoResponse> listarPorStatus(StatusChamado status, Pageable pageable);

    Page<ChamadoResponse> listarPorSolicitante(Long solicitanteId, Pageable pageable);

    Page<ChamadoResponse> listarPorTecnico(Long tecnicoId, Pageable pageable);

    Page<ChamadoResponse> buscar(String termo, Pageable pageable);

    ChamadoResponse atualizarStatus(Long id, AtualizarStatusRequest request, Long autorId);

    void deletar(Long id);
}
