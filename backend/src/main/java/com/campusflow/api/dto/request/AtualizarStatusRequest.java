package com.campusflow.api.dto.request;

import com.campusflow.api.enums.StatusChamado;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(

        @NotNull(message = "Novo status é obrigatório")
        StatusChamado novoStatus,

        String comentario,      // opcional

        Long tecnicoId          // usado ao atribuir um técnico
) {}
