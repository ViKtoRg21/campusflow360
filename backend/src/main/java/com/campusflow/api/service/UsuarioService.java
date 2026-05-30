package com.campusflow.api.service;

import com.campusflow.api.dto.request.CriarUsuarioRequest;
import com.campusflow.api.dto.response.UsuarioResponse;
import com.campusflow.api.enums.Role;

import java.util.List;

public interface UsuarioService {
    UsuarioResponse criar(CriarUsuarioRequest request);
    UsuarioResponse buscarPorId(Long id);
    List<UsuarioResponse> listarTodos();
    List<UsuarioResponse> listarPorRole(Role role);
    void desativar(Long id);
}
