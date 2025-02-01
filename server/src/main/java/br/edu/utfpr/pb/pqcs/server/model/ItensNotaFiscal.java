package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "tb_itensnotafiscal")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItensNotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Float quantidade;

    @NotNull
    private Float preco;

    @NotNull
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate data;

    @NotNull
    private String lote;

    @ManyToOne
    @JoinColumn(name = "produtoquimico_id", referencedColumnName = "id")
    @NotNull
    private ProdutoQuimico produtoQuimico;

    @ManyToOne
    @JoinColumn(name = "notafiscal_id", referencedColumnName = "id")
    @NotNull
    private NotaFiscal notaFiscal;
}
