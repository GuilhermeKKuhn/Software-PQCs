package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.OrgaoControlador;
import br.edu.utfpr.pb.pqcs.server.model.UnidadeMedida;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class ProdutoQuimicoDTO {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String cas;

    @NotNull
    private String caracteristica;

    @NotNull
    private String estadoFisico;

    @NotNull
    private String concentracao;

    @NotNull
    private String densidade;

    @NotNull
    private UnidadeMedidaDTO unidadeMedida;

    @NotNull
    private Set<OrgaoControlador> orgaos;
}