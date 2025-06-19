package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class EstoqueLoteDTO {

    private String lote;
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;
    private Double quantidade;
    private String laboratorio;

    public EstoqueLoteDTO(String lote, LocalDate dataFabricacao, LocalDate dataValidade, Double quantidade, String laboratorio) {
        this.lote = lote;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.quantidade = quantidade;
        this.laboratorio = laboratorio;
    }
}
