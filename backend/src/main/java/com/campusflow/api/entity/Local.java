package com.campusflow.api.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Representa um ambiente físico da instituição:
 * sala de aula, laboratório, secretaria, etc.
 */
@Entity
@Table(name = "locais")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Local extends BaseEntity {

    @Column(nullable = false, length = 80)
    private String nome;

    @Column(length = 20)
    private String bloco;

    @Column(length = 10)
    private String andar;

    @Column(length = 200)
    private String descricao;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
