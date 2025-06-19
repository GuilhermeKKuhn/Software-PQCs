package br.edu.utfpr.pb.pqcs.server.dto;

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
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;

}
