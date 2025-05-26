package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
public class MovimentacaoDTO {

    private Long id;
    private String tipo;
    private Long laboratorioOrigemId;
    private Long laboratorioDestinoId;
    private NotaFiscalDTO notaFiscal;
    private List<ItemMovimentacaoDTO> itens;

}
