package com.campusflow.api;

import com.campusflow.api.dto.request.CriarChamadoRequest;
import com.campusflow.api.entity.Usuario;
import com.campusflow.api.enums.CategoriaChamado;
import com.campusflow.api.enums.Role;
import com.campusflow.api.enums.StatusChamado;
import com.campusflow.api.repository.*;
import com.campusflow.api.service.impl.ChamadoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChamadoServiceTest {

    @Mock ChamadoRepository chamadoRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock LocalRepository localRepository;
    @Mock EquipamentoRepository equipamentoRepository;
    @Mock AtualizacaoChamadoRepository atualizacaoRepository;

    @InjectMocks ChamadoServiceImpl chamadoService;

    private Usuario solicitante;

    @BeforeEach
    void setUp() {
        solicitante = Usuario.builder()
                .nome("Aluno Teste").email("aluno@test.com")
                .senha("hash").role(Role.ALUNO).build();
        // Simula ID gerado pelo JPA
        try {
            var f = com.campusflow.api.entity.BaseEntity.class.getDeclaredField("id");
            f.setAccessible(true);
            f.set(solicitante, 1L);
        } catch (Exception ignored) {}
    }

    @Test
    void deveCriarChamadoComStatusAberto() {
        var request = new CriarChamadoRequest(
                "Projetor com defeito", "O projetor da sala 205 não liga.",
                CategoriaChamado.EQUIPAMENTO, null, null, null);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(solicitante));
        when(chamadoRepository.save(any())).thenAnswer(inv -> {
            var c = inv.getArgument(0, com.campusflow.api.entity.Chamado.class);
            try {
                var f = com.campusflow.api.entity.BaseEntity.class.getDeclaredField("id");
                f.setAccessible(true);
                f.set(c, 10L);
            } catch (Exception ignored) {}
            return c;
        });

        var response = chamadoService.criar(request, 1L);

        assertThat(response.status()).isEqualTo(StatusChamado.ABERTO);
        assertThat(response.titulo()).isEqualTo("Projetor com defeito");
        assertThat(response.solicitante().nome()).isEqualTo("Aluno Teste");
    }
}
