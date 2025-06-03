package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.service.IEstoqueService;
import br.edu.utfpr.pb.pqcs.server.service.impl.EstoqueServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/estoques")
public class EstoqueController {

    private final EstoqueServiceImpl estoqueService;

    public EstoqueController(EstoqueServiceImpl estoqueService) {
        this.estoqueService = estoqueService;
    }

    @GetMapping("/lotes-disponiveis")
    public List<LoteDisponivelDTO> getLotesDisponiveis(
            @RequestParam Long produtoId,
            @RequestParam Long laboratorioId) {
        return estoqueService.listarLotesDisponiveis(produtoId, laboratorioId);
    }
}
