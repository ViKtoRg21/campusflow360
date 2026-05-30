package com.campusflow.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campusFlowOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("CampusFlow 360 API")
                .description("API REST para gestão de chamados acadêmicos, administrativos e de infraestrutura")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Equipe CampusFlow")
                    .email("dev@campusflow.com")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Desenvolvimento"),
                new Server().url("https://api.campusflow.com").description("Produção")
            ));
    }
}
