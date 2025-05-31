package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.OrgaoControlador;
import br.edu.utfpr.pb.pqcs.server.model.UnidadeMedida;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Enumerated(EnumType.STRING)
    private OrgaoControlador orgao;

    @NotNull
    private String estadoFisico;

    @NotNull
    private UnidadeMedidaDTO unidadeMedida;

}
