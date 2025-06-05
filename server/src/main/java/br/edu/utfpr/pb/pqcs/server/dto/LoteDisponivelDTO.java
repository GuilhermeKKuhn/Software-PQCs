package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoteDisponivelDTO {

    private String lote;
    private Double quantidade;
    private LocalDateTime validade;
    private Long laboratorioId;
    private String nomeLaboratorio;

    public LoteDisponivelDTO(String lote, Double quantidade, LocalDateTime validade, Long laboratorioId, String nomeLaboratorio) {
        this.lote = lote;
        this.quantidade = quantidade;
        this.validade = validade;
        this.laboratorioId = laboratorioId;
        this.nomeLaboratorio = nomeLaboratorio;
    }

    public LoteDisponivelDTO(String lote, Double quantidade, LocalDateTime validade, Long laboratorioId) {
        this.lote = lote;
        this.quantidade = quantidade;
        this.validade = validade;
        this.laboratorioId = laboratorioId;
    }
}
