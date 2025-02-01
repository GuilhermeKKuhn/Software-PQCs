package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "tb_movimentacao")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Float quantidade;

    @NotNull
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataMovimentacao;

    @NotNull
    private String tipoMovimentacao;

    @ManyToOne
    @JoinColumn(name = "produto_id",referencedColumnName = "id")
    @NotNull
    private ProdutoQuimico produto;

    @ManyToOne
    @JoinColumn(name = "solicitante_id", referencedColumnName = "id")
    @NotNull
    private User solicitante;

    @ManyToOne
    @JoinColumn(name = "laborigem_id", referencedColumnName = "id")
    @NotNull
    private Laboratorio laboratorioOrigem;

    @ManyToOne
    @JoinColumn(name = "labDestino_id", referencedColumnName = "id")
    @NotNull
    private Laboratorio laboratorioDestino;
}
