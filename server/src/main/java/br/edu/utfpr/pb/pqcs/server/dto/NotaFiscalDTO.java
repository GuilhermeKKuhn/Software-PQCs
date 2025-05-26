package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.Fornecedor;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class NotaFiscalDTO {

    private Long id;
    private Long numeroNotaFiscal;
    private LocalDate dataRecebimento;
    private FornecedorDTO fornecedor;

}
