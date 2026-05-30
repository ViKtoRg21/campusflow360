package com.campusflow.api.dto.response;

public record EquipamentoResponse(
        Long id,
        String nome,
        String numeroPatrimonio,
        String modelo,
        String fabricante,
        boolean operacional,
        LocalResumo local
) {
    public record LocalResumo(Long id, String nome, String bloco) {}
}
