package br.edu.utfpr.pb.pqcs.server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemMovimentacaoDTO {

    private Long produtoId;
    private String nomeProduto;
    private Double quantidade;
    private Double preco;
    private String lote;
    private Long idSolicitacaoItem;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fabricacao;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate validade;


}
