package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.EstoqueLoteDTO;
import br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.repository.EstoqueRepository;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.repository.ProdutoQuimicoRepository;
import br.edu.utfpr.pb.pqcs.server.service.IEstoqueService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstoqueServiceImpl extends CrudServiceImpl<Estoque, Long> implements IEstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final ProdutoQuimicoRepository produtoRepository;
    private final LaboratorioRepository laboratorioRepository;

    public EstoqueServiceImpl(EstoqueRepository estoqueRepository,
                              ProdutoQuimicoRepository produtoRepository,
                              LaboratorioRepository laboratorioRepository) {
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
        this.laboratorioRepository = laboratorioRepository;
    }

    public List<EstoqueProdutoDTO> listarProdutosComEstoque() {
        return estoqueRepository.listarResumoPorProduto();
    }

    public List<EstoqueLoteDTO> listarLotes(Long produtoId) {
        return estoqueRepository.listarLotesPorProduto(produtoId);
    }

    public List<LoteDisponivelDTO> listarLotesDisponiveis(Long produtoId, Long laboratorioId) {
        return estoqueRepository.findLotesDisponiveisPorProdutoELaboratorio(produtoId, laboratorioId);
    }


    @Override
    protected JpaRepository<Estoque, Long> getRepository() {
        return estoqueRepository;
    }
}
