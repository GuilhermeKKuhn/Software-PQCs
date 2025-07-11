package br.edu.utfpr.pb.pqcs.server.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private Double quantidade;

    @NotNull
    @DateTimeFormat
    private LocalDateTime dataMovimentacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimentacao;

    @NotNull
    private String lote;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate Fabricacao;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate Validade;

    @Enumerated(EnumType.STRING)
    @Column(name = "motivo_saida")
    private MotivoSaida motivoSaida;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "notaFiscal_id", referencedColumnName = "id")
    private NotaFiscal notaFiscal;

    @ManyToOne
    @JoinColumn(name = "produto_id",referencedColumnName = "id")
    @NotNull
    private ProdutoQuimico produto;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "laborigem_id", referencedColumnName = "id")
    private Laboratorio laboratorioOrigem;

    @ManyToOne
    @JoinColumn(name = "labDestino_id", referencedColumnName = "id")
    private Laboratorio laboratorioDestino;
}
