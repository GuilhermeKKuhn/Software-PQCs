package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ItemSolicitacaoDTO {

    private Long id;
    private Long produtoId;
    private Float quantidadeSolicitada;
    private Float quantidadeAprovada;
    private String loteSelecionado;
    private Long laboratorioOrigemId;
    private String nomeProduto;


}
