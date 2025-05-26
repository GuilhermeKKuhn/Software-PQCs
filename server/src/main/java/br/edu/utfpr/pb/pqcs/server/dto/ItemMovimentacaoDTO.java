package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

@Data
public class ItemMovimentacaoDTO {

    private Long produtoId;
    private Double quantidade;
    private Double preco;
    private String lote;
}
