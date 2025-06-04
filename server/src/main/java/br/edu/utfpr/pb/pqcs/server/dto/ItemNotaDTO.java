package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

@Data
public class ItemNotaDTO {

    private String nomeProduto;
    private String lote;
    private Double quantidade;

    public ItemNotaDTO(String nomeProduto, String lote, Double quantidade) {
        this.nomeProduto = nomeProduto;
        this.lote = lote;
        this.quantidade = quantidade;
    }
}
