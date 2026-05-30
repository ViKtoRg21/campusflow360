package com.campusflow.api.dto.response;

import java.util.List;
import java.util.Map;

/**
 * Payload completo para o dashboard gerencial do CampusFlow 360.
 * O React consome este endpoint em /api/v1/dashboard.
 */
public record DashboardResponse(

        // Totais por status
        long totalAbertos,
        long totalEmAtendimento,
        long totalResolvidos,
        long totalCancelados,

        // Tempo médio de resolução (em minutos)
        Double tempoMedioResolucaoMinutos,

        // Distribuição por categoria  { "INFRAESTRUTURA": 12, "EQUIPAMENTO": 7 ... }
        Map<String, Long> chamadosPorCategoria,

        // Distribuição por status
        Map<String, Long> chamadosPorStatus,

        // Top técnicos por volume de chamados atendidos
        List<TecnicoRanking> rankingTecnicos
) {
    public record TecnicoRanking(String nomeTecnico, long totalChamados) {}
}
