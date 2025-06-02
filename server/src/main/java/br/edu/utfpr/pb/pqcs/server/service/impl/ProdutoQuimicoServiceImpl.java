package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.repository.EstoqueRepository;
import br.edu.utfpr.pb.pqcs.server.repository.ProdutoQuimicoRepository;
import br.edu.utfpr.pb.pqcs.server.service.IProdutoQuimicoService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoQuimicoServiceImpl extends CrudServiceImpl<ProdutoQuimico, Long>
        implements IProdutoQuimicoService {

    private final ProdutoQuimicoRepository produtoQuimicoRepository;
    private final EstoqueRepository estoqueRepository;

    public ProdutoQuimicoServiceImpl(ProdutoQuimicoRepository produtoQuimicoRepository, EstoqueRepository estoqueRepository ) {
        this.produtoQuimicoRepository = produtoQuimicoRepository;
        this.estoqueRepository = estoqueRepository;
    }

    public List<LoteDisponivelDTO> buscarLotesDisponiveisPorProduto(Long produtoId) {
        return estoqueRepository.buscarLotesDisponiveisPorProduto(produtoId);
    }

    @Override
    protected JpaRepository<ProdutoQuimico, Long> getRepository() {
        return produtoQuimicoRepository;
    }

   
}
