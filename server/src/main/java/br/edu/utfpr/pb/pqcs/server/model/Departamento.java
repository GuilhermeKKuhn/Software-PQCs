package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_departamento")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nomeDepartamento;

    @ManyToOne
    @JoinColumn(name = "responsavel_id", referencedColumnName = "id")
    private User responsavel;
}
