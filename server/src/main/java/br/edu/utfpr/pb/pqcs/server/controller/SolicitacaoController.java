package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.ItemSolicitacaoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.MovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.SolicitacaoDTO;
import br.edu.utfpr.pb.pqcs.server.service.impl.SolicitacaoServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    private SolicitacaoServiceImpl solicitacaoService;

    public SolicitacaoController(SolicitacaoServiceImpl solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public SolicitacaoDTO criar(@RequestBody SolicitacaoDTO dto) {
        return solicitacaoService.criar(dto);
    }

    @GetMapping("/pendentes")
    public List<SolicitacaoDTO> listarPendentes() {
        return solicitacaoService.listarPendentes();
    }

    @PostMapping("/{id}/aprovar")
    public void aprovar(@PathVariable Long id, @RequestBody List<ItemSolicitacaoDTO> itens) {
        solicitacaoService.aprovar(id, itens);
    }

    @GetMapping("/{id}/movimentacao-preenchida")
    public ResponseEntity<MovimentacaoDTO> gerarMovimentacaoDaSolicitacao(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.gerarMovimentacaoPreenchida(id));
    }

    @GetMapping("/listartodas")
    public List<SolicitacaoDTO> listarTodasVisiveis() {
        return solicitacaoService.listarTodasVisiveis();
    }

}
