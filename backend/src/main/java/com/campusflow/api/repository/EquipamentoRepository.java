package com.campusflow.api.repository;

import com.campusflow.api.entity.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findAllByLocalIdAndOperacionalTrue(Long localId);
    List<Equipamento> findAllByOperacionalFalse();
}
