package com.campusflow.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * Equipamento pertencente a um local.
 * Ex: Projetor Sala 101, PC Lab 03 – Estação 12.
 */
@Entity
@Table(name = "equipamentos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Equipamento extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 50)
    private String numeroPatrimonio;

    @Column(length = 80)
    private String modelo;

    @Column(length = 80)
    private String fabricante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "local_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Local local;

    @Column(nullable = false)
    @Builder.Default
    private boolean operacional = true;
}
