package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "tb_solicitacao")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Float quantidade;

    @NotNull
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataSolicitacao;

    @ManyToOne
    @JoinColumn(name = "solicitante_id", referencedColumnName = "id")
    @NotNull
    private User solicitante;

    @ManyToOne
    @JoinColumn(name = "laboratorio_id", referencedColumnName = "id")
    @NotNull
    private Laboratorio laboratorio;

    @ManyToOne
    @JoinColumn(name = "produto_id", referencedColumnName = "id")
    @NotNull
    private ProdutoQuimico produto;

}
