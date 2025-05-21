package br.edu.utfpr.pb.pqcs.server.model;

import br.edu.utfpr.pb.pqcs.server.annotation.UniqueUsername;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Entity
@Table(name = "tb_user")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private long id;

    @UniqueUsername
    @NotNull(message = "{br.edu.utfpr.pb.pw26s.server.user.username.constraints.NotNull.message}")
    @Column(length = 50)
    @Getter
    @Setter
    private String username;

    @UniqueUsername
    @NotNull(message = "{br.edu.utfpr.pb.pw26s.server.user.username.constraints.NotNull.message}")
    @Column(length = 50)
    @Getter
    @Setter
    private String name;

    @NotNull(message = "{br.edu.utfpr.pb.pw26s.server.user.password.constraints.NotNull.message}")
    @Size(min = 6)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{br.edu.utfpr.pb.pw26s.server.user.password.constraints.Pattern.message}")
    @Getter
    @Setter
    private String password;

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
    @Getter
    @Setter
    private TipoPerfil tipoPerfil;

    @NotNull
    @Getter
    @Setter
    private String siape;

    @Override
    @Transient
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = switch (this.getTipoPerfil()) {
            case ADMINISTRADOR -> "ROLE_ADMINISTRADOR";
            case RESPONSAVEL_DEPARTAMENTO -> "ROLE_RESPONSAVEL_DEPARTAMENTO";
            case RESPONSAVEL_LABORATORIO -> "ROLE_RESPONSAVEL_LABORATORIO";
        };
        return AuthorityUtils.createAuthorityList(role);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @Transient
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
