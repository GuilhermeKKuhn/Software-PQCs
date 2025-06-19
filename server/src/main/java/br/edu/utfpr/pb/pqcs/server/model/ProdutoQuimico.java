package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(
        name = "tb_produto_quimico",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"cas", "concentracao", "densidade"}
        )
)
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
    private String caracteristica;

    @NotNull
    private String estadoFisico;

    @NotNull
    private String concentracao;

    @NotNull
    private String densidade;

    @Size(min = 1)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produto_quimico_orgao",
            joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "orgao")
    @Enumerated(EnumType.STRING)
    private Set<OrgaoControlador> orgaos;

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
