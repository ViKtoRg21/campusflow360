package com.campusflow.api.service.impl;

import com.campusflow.api.dto.request.AtualizarStatusRequest;
import com.campusflow.api.dto.request.CriarChamadoRequest;
import com.campusflow.api.dto.response.AtualizacaoResponse;
import com.campusflow.api.dto.response.ChamadoResponse;
import com.campusflow.api.entity.AtualizacaoChamado;
import com.campusflow.api.entity.Chamado;
import com.campusflow.api.entity.Usuario;
import com.campusflow.api.enums.Prioridade;
import com.campusflow.api.enums.Role;
import com.campusflow.api.enums.StatusChamado;
import com.campusflow.api.exception.BusinessException;
import com.campusflow.api.exception.ResourceNotFoundException;
import com.campusflow.api.repository.*;
import com.campusflow.api.service.ChamadoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChamadoServiceImpl implements ChamadoService {

    private final ChamadoRepository chamadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LocalRepository localRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final AtualizacaoChamadoRepository atualizacaoRepository;

    // ─────────────────────────────────────────────────────────────
    //  CRIAR
    // ─────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public ChamadoResponse criar(CriarChamadoRequest request, Long solicitanteId) {
        var solicitante = buscarUsuario(solicitanteId);

        var builder = Chamado.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .categoria(request.categoria())
                .prioridade(request.prioridade() != null ? request.prioridade() : Prioridade.MEDIA)
                .solicitante(solicitante);

        if (request.localId() != null) {
            builder.local(localRepository.findById(request.localId())
                    .orElseThrow(() -> new ResourceNotFoundException("Local", request.localId())));
        }
        if (request.equipamentoId() != null) {
            builder.equipamento(equipamentoRepository.findById(request.equipamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipamento", request.equipamentoId())));
        }

        var chamado = chamadoRepository.save(builder.build());
        log.info("Chamado #{} criado por usuário #{}", chamado.getId(), solicitanteId);
        return toResponse(chamado);
    }

    // ─────────────────────────────────────────────────────────────
    //  LEITURA
    // ─────────────────────────────────────────────────────────────
    @Override
    public ChamadoResponse buscarPorId(Long id) {
        return toResponse(buscarChamado(id));
    }

    @Override
    public Page<ChamadoResponse> listarTodos(Pageable pageable) {
        return chamadoRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public Page<ChamadoResponse> listarPorStatus(StatusChamado status, Pageable pageable) {
        return chamadoRepository.findAllByStatus(status, pageable).map(this::toResponse);
    }

    @Override
    public Page<ChamadoResponse> listarPorSolicitante(Long solicitanteId, Pageable pageable) {
        return chamadoRepository.findAllBySolicitanteId(solicitanteId, pageable).map(this::toResponse);
    }

    @Override
    public Page<ChamadoResponse> listarPorTecnico(Long tecnicoId, Pageable pageable) {
        return chamadoRepository.findAllByTecnicoResponsavelId(tecnicoId, pageable).map(this::toResponse);
    }

    @Override
    public Page<ChamadoResponse> buscar(String termo, Pageable pageable) {
        return chamadoRepository.buscarPorTermo(termo, pageable).map(this::toResponse);
    }

    // ─────────────────────────────────────────────────────────────
    //  ATUALIZAR STATUS
    // ─────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public ChamadoResponse atualizarStatus(Long id, AtualizarStatusRequest req, Long autorId) {
        var chamado = buscarChamado(id);
        var autor = buscarUsuario(autorId);

        validarTransicaoStatus(chamado.getStatus(), req.novoStatus());

        var statusAnterior = chamado.getStatus();

        // Atribuir técnico, se informado
        if (req.tecnicoId() != null) {
            var tecnico = buscarUsuario(req.tecnicoId());
            if (tecnico.getRole() != Role.TECNICO && tecnico.getRole() != Role.ADMIN) {
                throw new BusinessException("Usuário informado não possui perfil de técnico.");
            }
            chamado.setTecnicoResponsavel(tecnico);
            if (chamado.getDataAtribuicao() == null) {
                chamado.setDataAtribuicao(LocalDateTime.now());
            }
        }

        // Fechar chamado
        if (req.novoStatus() == StatusChamado.RESOLVIDO) {
            chamado.fechar();
        } else {
            chamado.setStatus(req.novoStatus());
        }

        // Registrar histórico
        var atualizacao = AtualizacaoChamado.builder()
                .chamado(chamado)
                .autor(autor)
                .comentario(req.comentario())
                .statusAnterior(statusAnterior)
                .novoStatus(req.novoStatus())
                .build();
        chamado.getAtualizacoes().add(atualizacao);

        log.info("Chamado #{} atualizado: {} → {} por usuário #{}",
                id, statusAnterior, req.novoStatus(), autorId);

        return toResponse(chamadoRepository.save(chamado));
    }

    // ─────────────────────────────────────────────────────────────
    //  DELETAR
    // ─────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public void deletar(Long id) {
        var chamado = buscarChamado(id);
        chamadoRepository.delete(chamado);
    }

    // ─────────────────────────────────────────────────────────────
    //  HELPERS PRIVADOS
    // ─────────────────────────────────────────────────────────────
    private Chamado buscarChamado(Long id) {
        return chamadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado", id));
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private void validarTransicaoStatus(StatusChamado atual, StatusChamado novo) {
        if (atual == StatusChamado.RESOLVIDO || atual == StatusChamado.CANCELADO) {
            throw new BusinessException(
                    "Chamado já encerrado (status: " + atual + "). Não é possível alterar.");
        }
    }

    private ChamadoResponse toResponse(Chamado c) {
        List<AtualizacaoResponse> atualizacoes = c.getAtualizacoes().stream()
                .map(a -> new AtualizacaoResponse(
                        a.getId(),
                        a.getAutor().getNome(),
                        a.getComentario(),
                        a.getStatusAnterior(),
                        a.getNovoStatus(),
                        a.getCriadoEm()))
                .toList();

        return new ChamadoResponse(
                c.getId(),
                c.getTitulo(),
                c.getDescricao(),
                c.getStatus(),
                c.getPrioridade(),
                c.getCategoria(),
                c.getSolicitante() != null
                        ? new ChamadoResponse.UsuarioResumo(
                        c.getSolicitante().getId(),
                        c.getSolicitante().getNome(),
                        c.getSolicitante().getEmail())
                        : null,
                c.getTecnicoResponsavel() != null
                        ? new ChamadoResponse.UsuarioResumo(
                        c.getTecnicoResponsavel().getId(),
                        c.getTecnicoResponsavel().getNome(),
                        c.getTecnicoResponsavel().getEmail())
                        : null,
                c.getLocal() != null
                        ? new ChamadoResponse.LocalResumo(
                        c.getLocal().getId(),
                        c.getLocal().getNome(),
                        c.getLocal().getBloco())
                        : null,
                c.getEquipamento() != null
                        ? new ChamadoResponse.EquipamentoResumo(
                        c.getEquipamento().getId(),
                        c.getEquipamento().getNome(),
                        c.getEquipamento().getNumeroPatrimonio())
                        : null,
                c.getDataAtribuicao(),
                c.getDataResolucao(),
                c.getTempoResolucaoMinutos(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                atualizacoes
        );
    }
}
