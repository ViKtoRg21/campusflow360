package com.campusflow.api.entity;

import com.campusflow.api.enums.Role;
import jakarta.persistence.*;
import lombok.*;

/**
 * Representa qualquer usuário do sistema:
 * aluno, professor, técnico, gestor ou admin.
 */
@Entity
@Table(name = "usuarios",
        uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Usuario extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
