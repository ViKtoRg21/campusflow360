package com.campusflow.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CriarEquipamentoRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 100)
        String nome,

        String numeroPatrimonio,
        String modelo,
        String fabricante,
        Long localId
) {}
