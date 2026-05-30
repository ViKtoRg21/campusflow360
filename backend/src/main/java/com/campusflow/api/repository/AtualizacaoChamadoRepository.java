package com.campusflow.api.repository;

import com.campusflow.api.entity.AtualizacaoChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtualizacaoChamadoRepository extends JpaRepository<AtualizacaoChamado, Long> {
    List<AtualizacaoChamado> findAllByChamadoIdOrderByCriadoEmAsc(Long chamadoId);
}
