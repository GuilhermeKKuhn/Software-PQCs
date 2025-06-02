package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.dto.ProdutoQuimicoDTO;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.repository.EstoqueRepository;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IProdutoQuimicoService;
import br.edu.utfpr.pb.pqcs.server.service.impl.ProdutoQuimicoServiceImpl;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "produtoquimico")
public class ProdutoQuimicoController extends CrudController<ProdutoQuimico, ProdutoQuimicoDTO, Long>{

    private static IProdutoQuimicoService iprodutoQuimicoService;
    private static ModelMapper modelMapper;
    private static ProdutoQuimicoServiceImpl produtoQuimicoService;


    public ProdutoQuimicoController(IProdutoQuimicoService iprodutoQuimicoService, ModelMapper modelMapper, ProdutoQuimicoServiceImpl produtoQuimicoService) {
        super(ProdutoQuimico.class, ProdutoQuimicoDTO.class);
        this.iprodutoQuimicoService = iprodutoQuimicoService;
        this.modelMapper = modelMapper;
        this.produtoQuimicoService = produtoQuimicoService;
    }

    @GetMapping("/lotes-disponiveis/{produtoId}")
    public ResponseEntity<List<LoteDisponivelDTO>> getLotesDisponiveis(@PathVariable Long produtoId) {
        List<LoteDisponivelDTO> lotes = produtoQuimicoService.buscarLotesDisponiveisPorProduto(produtoId);
        return ResponseEntity.ok(lotes);
    }


    @Override
    protected ICrudService<ProdutoQuimico, Long> getService() {
        return ProdutoQuimicoController.iprodutoQuimicoService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return ProdutoQuimicoController.modelMapper;
    }
}
