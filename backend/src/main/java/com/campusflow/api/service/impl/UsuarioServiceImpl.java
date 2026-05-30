package com.campusflow.api.service.impl;

import com.campusflow.api.dto.request.CriarUsuarioRequest;
import com.campusflow.api.dto.response.UsuarioResponse;
import com.campusflow.api.entity.Usuario;
import com.campusflow.api.enums.Role;
import com.campusflow.api.exception.BusinessException;
import com.campusflow.api.exception.ResourceNotFoundException;
import com.campusflow.api.repository.UsuarioRepository;
import com.campusflow.api.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UsuarioResponse criar(CriarUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado: " + request.email());
        }
        var usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .role(request.role())
                .telefone(request.telefone())
                .build();
        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id)));
    }

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAllByAtivoTrue().stream().map(this::toResponse).toList();
    }

    @Override
    public List<UsuarioResponse> listarPorRole(Role role) {
        return usuarioRepository.findAllByRoleAndAtivoTrue(role).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public void desativar(Long id) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        usuario.setAtivo(false);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(),
                u.getRole(), u.getTelefone(), u.isAtivo(), u.getCreatedAt());
    }
}
