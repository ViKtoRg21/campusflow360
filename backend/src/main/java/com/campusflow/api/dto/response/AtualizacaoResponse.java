package com.campusflow.api.dto.response;

import com.campusflow.api.enums.StatusChamado;
import java.time.LocalDateTime;

public record AtualizacaoResponse(
        Long id,
        String autorNome,
        String comentario,
        StatusChamado statusAnterior,
        StatusChamado novoStatus,
        LocalDateTime criadoEm
) {}
