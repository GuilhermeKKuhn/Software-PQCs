package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.MovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.service.ImovimentacaoService;
import br.edu.utfpr.pb.pqcs.server.service.impl.MovimentacaoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoServiceImpl movimentacaoService;

    @PostMapping("/movimentacoes")
    public ResponseEntity<List<MovimentacaoDTO>> realizarMovimentacoes(@RequestBody MovimentacaoDTO dto) {
        List<MovimentacaoDTO> result = movimentacaoService.realizarMovimentacoes(dto);
        return ResponseEntity.ok(result);
    }


    @GetMapping
    public List<MovimentacaoDTO> listar() {
        return movimentacaoService.listar();
    }

    @GetMapping("/{id}")
    public MovimentacaoDTO buscarPorId(@PathVariable Long id) {
        return movimentacaoService.buscarPorId(id);
    }
}