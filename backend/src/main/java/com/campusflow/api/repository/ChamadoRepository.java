package com.campusflow.api.repository;

import com.campusflow.api.entity.Chamado;
import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.Prioridade;
import com.campusflow.api.enums.StatusChamado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    // ── Listagens filtradas ──────────────────────────────────────
    Page<Chamado> findAllByStatus(StatusChamado status, Pageable pageable);

    Page<Chamado> findAllBySolicitanteId(Long solicitanteId, Pageable pageable);

    Page<Chamado> findAllByTecnicoResponsavelId(Long tecnicoId, Pageable pageable);

    Page<Chamado> findAllByCategoriaAndStatus(
            CategoriaChamado categoria, StatusChamado status, Pageable pageable);

    // ── Contagens para dashboard ─────────────────────────────────
    long countByStatus(StatusChamado status);

    long countByPrioridade(Prioridade prioridade);

    long countByCategoriaAndStatus(CategoriaChamado categoria, StatusChamado status);

    // ── Indicadores gerenciais ───────────────────────────────────
    @Query("SELECT AVG(c.tempoResolucaoMinutos) FROM Chamado c " +
           "WHERE c.status = 'RESOLVIDO' AND c.tempoResolucaoMinutos IS NOT NULL")
    Double calcularTempoMedioResolucaoMinutos();

    @Query("SELECT c.categoria, COUNT(c) FROM Chamado c GROUP BY c.categoria ORDER BY COUNT(c) DESC")
    List<Object[]> contarChamadosPorCategoria();

    @Query("SELECT c.status, COUNT(c) FROM Chamado c GROUP BY c.status")
    List<Object[]> contarChamadosPorStatus();

    @Query("SELECT c.tecnicoResponsavel.nome, COUNT(c) FROM Chamado c " +
           "WHERE c.tecnicoResponsavel IS NOT NULL " +
           "GROUP BY c.tecnicoResponsavel.nome ORDER BY COUNT(c) DESC")
    List<Object[]> chamadosPorTecnico();

    // ── Busca textual simples ────────────────────────────────────
    @Query("SELECT c FROM Chamado c WHERE " +
           "LOWER(c.titulo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.descricao) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Chamado> buscarPorTermo(@Param("termo") String termo, Pageable pageable);
}
