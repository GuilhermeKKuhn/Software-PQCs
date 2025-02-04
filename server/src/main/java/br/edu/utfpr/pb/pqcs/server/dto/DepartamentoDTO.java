package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepartamentoDTO {

    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private User responsavel;
}
