package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

@Data
public class EstoqueProdutoDTO {

    private Long id;
    private String nome;
    private Double quantidadeTotal;

    public EstoqueProdutoDTO(Long id, String nome, Double quantidadeTotal) {
        this.id = id;
        this.nome = nome;
        this.quantidadeTotal = quantidadeTotal;
    }
}
