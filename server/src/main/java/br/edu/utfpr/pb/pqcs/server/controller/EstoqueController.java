package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.EstoqueLoteDTO;
import br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.service.IEstoqueService;
import br.edu.utfpr.pb.pqcs.server.service.impl.EstoqueServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/resumo")
    public List<EstoqueProdutoDTO> listarResumoEstoque() {
        return estoqueService.listarEstoquePorPerfil();
    }


    @GetMapping("/lotes/{produtoId}")
    public List<EstoqueLoteDTO> listarLotes(@PathVariable Long produtoId) {
        return estoqueService.listarLotes(produtoId);
    }

    @GetMapping("/lotes-disponiveis/multilabs")
    public List<LoteDisponivelDTO> getLotesPorLaboratorios(
            @RequestParam Long produtoId,
            @RequestParam List<Long> laboratoriosIds) {
        return estoqueService.listarLotesDisponiveisPorLaboratorios(produtoId, laboratoriosIds);
    }

    @GetMapping("/lotes-disponiveis/departamentos")
    public List<LoteDisponivelDTO> getLotesPorDepartamentos(
            @RequestParam Long produtoId,
            @RequestParam List<Long> departamentosIds
    ) {
        return estoqueService.listarLotesPorProdutoEDepartamentos(produtoId, departamentosIds);
    }

    @PostMapping("/resumo/laboratorios")
    public List<EstoqueProdutoDTO> listarResumoPorLaboratorios(@RequestBody List<Long> laboratorioIds) {
        return estoqueService.listarResumoPorProdutosDosLaboratoriosId(laboratorioIds);
    }

    @PostMapping("/resumo/departamentos")
    public List<EstoqueProdutoDTO> listarResumoPorDepartamentos(@RequestBody List<Long> departamentoIds) {
        return estoqueService.listarResumoPorProdutosDosDepartamentosId(departamentoIds);
    }
}
