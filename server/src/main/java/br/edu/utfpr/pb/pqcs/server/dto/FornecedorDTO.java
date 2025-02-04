package br.edu.utfpr.pb.pqcs.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FornecedorDTO {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String cnpj;

}
