package com.campusflow.api.config;

import com.campusflow.api.entity.Equipamento;
import com.campusflow.api.entity.Local;
import com.campusflow.api.entity.Usuario;
import com.campusflow.api.enums.Role;
import com.campusflow.api.repository.EquipamentoRepository;
import com.campusflow.api.repository.LocalRepository;
import com.campusflow.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Popula o banco H2 com dados de demonstração no perfil dev.
 * Remova ou ajuste antes de ir para produção.
 */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final LocalRepository localRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) return; // Evita re-seed

        log.info(">>> Iniciando seed de dados DEV...");

        // Usuários
        var admin = usuarioRepository.save(Usuario.builder()
                .nome("Admin Sistema").email("admin@campusflow.com")
                .senha(passwordEncoder.encode("admin123")).role(Role.ADMIN).build());

        var gestor = usuarioRepository.save(Usuario.builder()
                .nome("Ana Gestora").email("ana@campusflow.com")
                .senha(passwordEncoder.encode("senha123")).role(Role.GESTOR).build());

        var tecnico = usuarioRepository.save(Usuario.builder()
                .nome("Carlos Técnico").email("carlos@campusflow.com")
                .senha(passwordEncoder.encode("senha123")).role(Role.TECNICO).build());

        var professor = usuarioRepository.save(Usuario.builder()
                .nome("Prof. Maria Silva").email("maria@campusflow.com")
                .senha(passwordEncoder.encode("senha123")).role(Role.PROFESSOR).build());

        var aluno = usuarioRepository.save(Usuario.builder()
                .nome("João Aluno").email("joao@campusflow.com")
                .senha(passwordEncoder.encode("senha123")).role(Role.ALUNO).build());

        // Locais
        var lab01 = localRepository.save(Local.builder()
                .nome("Laboratório de Informática 01").bloco("A").andar("1").build());
        var sala205 = localRepository.save(Local.builder()
                .nome("Sala 205").bloco("B").andar("2").build());
        var biblioteca = localRepository.save(Local.builder()
                .nome("Biblioteca").bloco("C").andar("1").build());

        // Equipamentos
        equipamentoRepository.save(Equipamento.builder()
                .nome("Projetor Epson").modelo("EX3280").fabricante("Epson")
                .numeroPatrimonio("PAT-001").local(sala205).build());
        equipamentoRepository.save(Equipamento.builder()
                .nome("PC Estação 05").modelo("Core i5 12ª Gen").fabricante("Dell")
                .numeroPatrimonio("PAT-002").local(lab01).build());
        equipamentoRepository.save(Equipamento.builder()
                .nome("Ar-condicionado").modelo("Split 12000 BTU").fabricante("LG")
                .numeroPatrimonio("PAT-003").local(biblioteca).operacional(false).build());

        log.info(">>> Seed concluído. Usuários criados: admin, gestor, técnico, professor, aluno");
        log.info(">>> IDs: admin={} | tecnico={} | aluno={}", admin.getId(), tecnico.getId(), aluno.getId());
    }
}
