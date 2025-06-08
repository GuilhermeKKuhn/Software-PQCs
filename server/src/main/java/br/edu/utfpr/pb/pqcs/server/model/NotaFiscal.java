package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "tb_notafiscal")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long numeroNotaFiscal;

    @NotNull
    private LocalDate dataRecebimento;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id", referencedColumnName = "id")
    @NotNull
    private Fornecedor fornecedor;


}
