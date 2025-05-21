package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class MovimentacaoDTO {

    private Long id;
    private Long produtoId;
    private Long laboratorioOrigemId;
    private Long laboratorioDestinoId;
    private Double quantidade;
    private String tipo;
    private String lote;
    private Long notaFiscalId;
    private LocalDateTime data;
    private Long usuarioId;
    private LocalDate validade;

}
