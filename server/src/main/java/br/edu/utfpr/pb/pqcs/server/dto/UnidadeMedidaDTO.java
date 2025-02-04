package br.edu.utfpr.pb.pqcs.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UnidadeMedidaDTO {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String sigla;
}
