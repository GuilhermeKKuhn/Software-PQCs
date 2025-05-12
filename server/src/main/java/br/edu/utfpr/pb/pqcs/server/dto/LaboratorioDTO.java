package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LaboratorioDTO {

    private Long id;

    @NotNull
    private String nomeLaboratorio;

    @NotNull
    private String sala;

    @NotNull
    private Departamento departamento;

    @NotNull
    private User responsavel;
}
