package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EstoqueLoteDTO {
    private String lote;
    private LocalDateTime validade;
    private Double quantidade;
    private String laboratorio;

    public EstoqueLoteDTO(String lote, LocalDateTime validade, Double quantidade, String laboratorio) {
        this.lote = lote;
        this.validade = validade;
        this.quantidade = quantidade;
        this.laboratorio = laboratorio;
    }
}
