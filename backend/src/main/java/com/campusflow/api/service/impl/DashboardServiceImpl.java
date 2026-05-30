package com.campusflow.api.service.impl;

import com.campusflow.api.dto.response.DashboardResponse;
import com.campusflow.api.enums.StatusChamado;
import com.campusflow.api.repository.ChamadoRepository;
import com.campusflow.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ChamadoRepository chamadoRepository;

    @Override
    public DashboardResponse gerarDashboard() {

        // Totais por status
        long abertos = chamadoRepository.countByStatus(StatusChamado.ABERTO);
        long emAtendimento = chamadoRepository.countByStatus(StatusChamado.EM_ATENDIMENTO);
        long resolvidos = chamadoRepository.countByStatus(StatusChamado.RESOLVIDO);
        long cancelados = chamadoRepository.countByStatus(StatusChamado.CANCELADO);

        // Tempo médio de resolução
        Double tempoMedio = chamadoRepository.calcularTempoMedioResolucaoMinutos();

        // Chamados por categoria
        Map<String, Long> porCategoria = toMap(chamadoRepository.contarChamadosPorCategoria());

        // Chamados por status
        Map<String, Long> porStatus = toMap(chamadoRepository.contarChamadosPorStatus());

        // Ranking de técnicos
        List<DashboardResponse.TecnicoRanking> ranking = chamadoRepository.chamadosPorTecnico()
                .stream()
                .map(row -> new DashboardResponse.TecnicoRanking(
                        (String) row[0],
                        (Long) row[1]))
                .collect(Collectors.toList());

        return new DashboardResponse(
                abertos, emAtendimento, resolvidos, cancelados,
                tempoMedio, porCategoria, porStatus, ranking);
    }

    private Map<String, Long> toMap(List<Object[]> rows) {
        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            result.put(row[0].toString(), (Long) row[1]);
        }
        return result;
    }
}
