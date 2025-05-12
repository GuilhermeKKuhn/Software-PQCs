package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.UnidadeMedida;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProdutoQuimicoDTO {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String cas;

    @NotNull
    private Integer validade;

    @NotNull
    private String caracteristica;

    @NotNull
    private String estadoFisico;

    @NotNull
    private UnidadeMedidaDTO unidadeMedida;

}
