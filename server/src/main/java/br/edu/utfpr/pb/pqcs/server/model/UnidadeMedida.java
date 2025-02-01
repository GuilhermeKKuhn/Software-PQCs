package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_unidade_medida")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UnidadeMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String sigla;


}
