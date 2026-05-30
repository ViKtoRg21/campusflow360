package com.campusflow.api.dto.response;

import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.Prioridade;
import com.campusflow.api.enums.StatusChamado;

import java.time.LocalDateTime;
import java.util.List;

public record ChamadoResponse(
        Long id,
        String titulo,
        String descricao,
        StatusChamado status,
        Prioridade prioridade,
        CategoriaChamado categoria,
        UsuarioResumo solicitante,
        UsuarioResumo tecnicoResponsavel,
        LocalResumo local,
        EquipamentoResumo equipamento,
        LocalDateTime dataAtribuicao,
        LocalDateTime dataResolucao,
        Long tempoResolucaoMinutos,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<AtualizacaoResponse> atualizacoes
) {
    // Registros aninhados para evitar expor entidades completas
    public record UsuarioResumo(Long id, String nome, String email) {}
    public record LocalResumo(Long id, String nome, String bloco) {}
    public record EquipamentoResumo(Long id, String nome, String numeroPatrimonio) {}
}
