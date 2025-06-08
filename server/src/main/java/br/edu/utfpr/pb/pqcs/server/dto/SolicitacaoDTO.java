package br.edu.utfpr.pb.pqcs.server.dto;

import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoDTO {

    private Long id;
    private Long laboratorioId;
    private Laboratorio laboratorio;
    private String solicitante;
    private String status;
    private LocalDate dataSolicitacao;
    private List<ItemSolicitacaoDTO> itens;
}

