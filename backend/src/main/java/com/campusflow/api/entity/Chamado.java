package com.campusflow.api.entity;

import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.Prioridade;
import com.campusflow.api.enums.StatusChamado;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade central do CampusFlow 360.
 * Representa um chamado aberto por um usuário,
 * atribuído a um técnico, referente a um local/equipamento.
 */
@Entity
@Table(name = "chamados",
        indexes = {
                @Index(name = "idx_chamado_status", columnList = "status"),
                @Index(name = "idx_chamado_solicitante", columnList = "solicitante_id"),
                @Index(name = "idx_chamado_tecnico", columnList = "tecnico_responsavel_id")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Chamado extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private StatusChamado status = StatusChamado.ABERTO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Prioridade prioridade = Prioridade.MEDIA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoriaChamado categoria;

    // Quem abriu o chamado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Usuario solicitante;

    // Técnico atribuído (pode ser nulo inicialmente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_responsavel_id")
    private Usuario tecnicoResponsavel;

    // Local onde ocorreu o problema
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_id")
    private Local local;

    // Equipamento específico (opcional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    // Histórico de atualizações
    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AtualizacaoChamado> atualizacoes = new ArrayList<>();

    // Controle de SLA
    private LocalDateTime dataAtribuicao;
    private LocalDateTime dataResolucao;

    // Tempo de resolução em minutos (calculado ao fechar)
    private Long tempoResolucaoMinutos;

    /**
     * Calcula e grava o tempo de resolução ao fechar o chamado.
     */
    public void fechar() {
        this.status = StatusChamado.RESOLVIDO;
        this.dataResolucao = LocalDateTime.now();
        if (this.dataAtribuicao != null) {
            this.tempoResolucaoMinutos = java.time.Duration
                    .between(this.dataAtribuicao, this.dataResolucao)
                    .toMinutes();
        }
    }
}
