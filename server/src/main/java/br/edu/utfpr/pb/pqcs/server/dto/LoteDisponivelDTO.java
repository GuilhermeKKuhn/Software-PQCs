package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoteDisponivelDTO {

    private String lote;
    private Double quantidade;
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;
    private Long laboratorioId;
    private String nomeLaboratorio;

    public LoteDisponivelDTO(String lote, Double quantidade, LocalDate dataFabricacao, LocalDate dataValidade, Long laboratorioId, String nomeLaboratorio) {
        this.lote = lote;
        this.quantidade = quantidade;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.laboratorioId = laboratorioId;
        this.nomeLaboratorio = nomeLaboratorio;
    }

    public LoteDisponivelDTO(String lote, Double quantidade, LocalDate dataFabricacao, LocalDate dataValidade, Long laboratorioId) {
        this.lote = lote;
        this.quantidade = quantidade;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.laboratorioId = laboratorioId;
    }
}