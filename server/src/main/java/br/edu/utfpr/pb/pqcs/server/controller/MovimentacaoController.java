package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.MovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.service.ImovimentacaoService;
import br.edu.utfpr.pb.pqcs.server.service.impl.MovimentacaoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoServiceImpl movimentacaoService;

    @PostMapping
    public MovimentacaoDTO movimentar(@RequestBody MovimentacaoDTO dto) {
        return movimentacaoService.realizarMovimentacao(dto);
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