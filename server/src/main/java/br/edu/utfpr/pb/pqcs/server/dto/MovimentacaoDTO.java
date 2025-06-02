package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.User;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
public class MovimentacaoDTO {

    private Long id;
    private String tipo;
    private Double quantidade;
    private String lote;
    private LocalDate validade;
    private LocalDateTime dataMovimentacao;

    private NotaFiscalDTO notaFiscal;

    private LaboratorioDTO laboratorioOrigem;
    private LaboratorioDTO laboratorioDestino;

    private List<ItemMovimentacaoDTO> itens;

    private UserDTO usuario;

}
