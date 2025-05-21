package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.annotation.UniqueUsername;
import br.edu.utfpr.pb.pqcs.server.model.TipoPerfil;
import br.edu.utfpr.pb.pqcs.server.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    @UniqueUsername
    @NotNull
    @Size(min = 4, max = 50)
    private String username;

    @UniqueUsername
    @NotNull
    @Size(min = 4, max = 50)
    private String name;

    @NotNull(message = "O email não pode ser nulo")
    @Column
    @Getter
    @Setter
    private String email;

    @NotNull(message = "O campo 'Ativo' não pode ser nulo")
    @Column
    @Getter
    @Setter
    private boolean ativo;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoPerfil tipoPerfil;

    @NotNull
    @Getter
    @Setter
    private String siape;

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
