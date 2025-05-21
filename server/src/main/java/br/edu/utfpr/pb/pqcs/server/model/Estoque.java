package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_estoque")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Float quantidade;

    @ManyToOne
    @JoinColumn(name = "produto_id", referencedColumnName = "id")
    @NotNull
    private ProdutoQuimico produto;

    @ManyToOne
    @JoinColumn(name = "laboratorio_id", referencedColumnName = "id")
    @NotNull
    private Laboratorio laboratorio;

    @ManyToOne
    @JoinColumn(name = "notafiscal_id", referencedColumnName = "id")
    @NotNull
    private NotaFiscal notaFiscal;

    private LocalDateTime validade;

    private String lote;

}
