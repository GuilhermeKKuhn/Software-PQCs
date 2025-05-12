package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "tb_produto_quimico")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProdutoQuimico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Long id;

    @NotNull
    @Getter @Setter
    private String nome;

    @NotNull
    @Getter @Setter
    private String cas;

    @NotNull
    private Integer validade;

    @NotNull
    private String caracteristica;

    @NotNull
    private String estadoFisico;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "unidademedida_id", referencedColumnName = "id")
    private UnidadeMedida unidadeMedida;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProdutoQuimico produtoQuimico = (ProdutoQuimico) o;
        return Objects.equals(id, produtoQuimico.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
