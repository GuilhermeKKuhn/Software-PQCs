package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_laboratorio")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Laboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nomeLaboratorio;

    @NotNull
    private String sala;

    @ManyToOne
    @JoinColumn(name = "departamento_id", referencedColumnName = "id")
    private Departamento departamento;

    @ManyToOne
    @JoinColumn(name = "responsavel_id", referencedColumnName = "id")
    private User responsavel;


}
