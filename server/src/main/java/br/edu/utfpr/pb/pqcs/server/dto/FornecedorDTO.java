package br.edu.utfpr.pb.pqcs.server.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FornecedorDTO {

    private Long id;

    @NotNull
    private String razaoSocial;

    @NotNull
    private String cnpj;

    @NotNull
    private String endereco;

    @NotNull
    private String numero;

    @NotNull
    private String cidade;

    @NotNull
    private String estado;

    @NotNull
    private String telefone;

    @NotNull
    private String email;

}
