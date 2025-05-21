package br.edu.utfpr.pb.pqcs.server.security.dto;

import br.edu.utfpr.pb.pqcs.server.model.TipoPerfil;
import br.edu.utfpr.pb.pqcs.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private String username;
    private String name;
    private String email;
    private TipoPerfil tipoPerfil;
    private String siape;
    private Set<AuthorityResponseDTO> authorities;

    public UserResponseDTO(User user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.tipoPerfil = user.getTipoPerfil();
        this.siape = user.getSiape();
        this.authorities = new HashSet<>();
        for (GrantedAuthority authority: user.getAuthorities()) {
            authorities.add( new AuthorityResponseDTO(authority.getAuthority()) );
        }
    }

}
