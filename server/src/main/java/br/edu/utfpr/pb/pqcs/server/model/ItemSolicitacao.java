package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_item_solicitacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemSolicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private ProdutoQuimico produto;

    @NotNull
    private Float quantidadeSolicitada;

    private Float quantidadeAprovada;
    private String loteSelecionado;
    private String nomeProduto;


    @ManyToOne
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;
}
