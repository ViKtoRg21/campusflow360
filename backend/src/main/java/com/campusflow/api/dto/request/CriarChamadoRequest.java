package com.campusflow.api.dto.request;

import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.Prioridade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CriarChamadoRequest(

        @NotBlank(message = "Título é obrigatório")
        @Size(min = 5, max = 150, message = "Título deve ter entre 5 e 150 caracteres")
        String titulo,

        @NotBlank(message = "Descrição é obrigatória")
        @Size(min = 10, message = "Descrição deve ter no mínimo 10 caracteres")
        String descricao,

        @NotNull(message = "Categoria é obrigatória")
        CategoriaChamado categoria,

        Prioridade prioridade,   // opcional; padrão MEDIA definido na entidade

        Long localId,            // opcional

        Long equipamentoId       // opcional
) {}
