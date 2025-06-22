package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

@Data
public class EstoqueProdutoDTO {

    private Long id;
    private String nome;
    private String cas;
    private String densidade;
    private String concentracao;
    private Double quantidadeTotal;

    public EstoqueProdutoDTO(Long id, String nome, String cas, String densidade, String concentracao, Double quantidadeTotal) {
        this.id = id;
        this.nome = nome;
        this.cas = cas;
        this.densidade = densidade;
        this.concentracao = concentracao;
        this.quantidadeTotal = quantidadeTotal;
    }
}
