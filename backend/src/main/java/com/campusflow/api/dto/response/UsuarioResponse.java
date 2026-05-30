package com.campusflow.api.dto.response;

import com.campusflow.api.enums.Role;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        Role role,
        String telefone,
        boolean ativo,
        LocalDateTime createdAt
) {}
