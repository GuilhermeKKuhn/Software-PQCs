package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.TipoPerfil;
import br.edu.utfpr.pb.pqcs.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String name;
    private String email;
    private boolean ativo;
    private TipoPerfil tipoPerfil;
    private String siape;

    private List<Long> laboratoriosId;
    private List<String> nomesLaboratorios;

    private List<Long> departamentosId;
    private List<String> nomesDepartamentos;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.ativo = user.isAtivo();
        this.tipoPerfil = user.getTipoPerfil();
        this.siape = user.getSiape();
    }
}

