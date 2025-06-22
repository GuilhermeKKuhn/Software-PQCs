package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
public class EstoqueLoteDTO {

    private String lote;
    private String dataFabricacao;
    private String dataValidade;
    private Double quantidade;
    private String laboratorio;
    private String nomeLaboratorio;

    private String cas;
    private String densidade;
    private String concentracao;

    public EstoqueLoteDTO(String lote, String dataFabricacao, String dataValidade, Double quantidade, String laboratorio, String nomeLaboratorio, String cas, String densidade, String concentracao) {
        this.lote = lote;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.quantidade = quantidade;
        this.laboratorio = laboratorio;
        this.nomeLaboratorio = nomeLaboratorio;
        this.cas = cas;
        this.densidade = densidade;
        this.concentracao = concentracao;
    }
}
