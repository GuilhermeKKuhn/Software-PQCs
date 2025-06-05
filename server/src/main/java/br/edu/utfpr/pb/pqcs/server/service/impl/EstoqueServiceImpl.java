package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.EstoqueLoteDTO;
import br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.*;
import br.edu.utfpr.pb.pqcs.server.repository.DepartamentoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.EstoqueRepository;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.repository.ProdutoQuimicoRepository;
import br.edu.utfpr.pb.pqcs.server.service.AuthService;
import br.edu.utfpr.pb.pqcs.server.service.IEstoqueService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class EstoqueServiceImpl extends CrudServiceImpl<Estoque, Long> implements IEstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final ProdutoQuimicoRepository produtoRepository;
    private final LaboratorioRepository laboratorioRepository;
    private final DepartamentoRepository departamentoRepository;
    private final AuthService authService;

    public EstoqueServiceImpl(EstoqueRepository estoqueRepository,
                              ProdutoQuimicoRepository produtoRepository,
                              LaboratorioRepository laboratorioRepository, AuthService authService, DepartamentoRepository departamentoRepository) {
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.authService = authService;
        this.departamentoRepository = departamentoRepository;
    }

    public List<EstoqueProdutoDTO> listarProdutosComEstoque() {
        return estoqueRepository.listarResumoPorProduto();
    }

    public List<EstoqueProdutoDTO> listarEstoquePorPerfil() {
        User user = authService.getUsuarioLogado();

        switch (user.getTipoPerfil()) {
            case ADMINISTRADOR:
                return listarProdutosComEstoque();

            case RESPONSAVEL_LABORATORIO:
                // Pega todos labs onde ele é responsável
                List<Laboratorio> labs = laboratorioRepository.findAllByResponsavelId(user.getId());
                return estoqueRepository.listarResumoPorProdutosDosLaboratorios(labs);

            case RESPONSAVEL_DEPARTAMENTO:
                List<Departamento> deps = departamentoRepository.findAllByResponsavelId(user.getId());
                return estoqueRepository.listarResumoPorProdutosDosDepartamentos(deps);

            default:
                return Collections.emptyList();
        }
    }


    public List<EstoqueLoteDTO> listarLotes(Long produtoId) {
        return estoqueRepository.listarLotesPorProduto(produtoId);
    }

    public List<LoteDisponivelDTO> listarLotesDisponiveis(Long produtoId, Long laboratorioId) {
        return estoqueRepository.findLotesDisponiveisPorProdutoELaboratorio(produtoId, laboratorioId);
    }

    public List<LoteDisponivelDTO> listarLotesDisponiveisPorLaboratorios(Long produtoId, List<Long> laboratoriosIds) {
        return estoqueRepository.findLotesDisponiveisPorProdutoELaboratorios(produtoId, laboratoriosIds);
    }

    public List<LoteDisponivelDTO> listarLotesPorProdutoEDepartamentos(Long produtoId, List<Long> departamentosIds) {
        return estoqueRepository.findLotesPorProdutoEDepartamentos(produtoId, departamentosIds);
    }

    public List<EstoqueProdutoDTO> listarResumoPorProdutosDosLaboratoriosId(List<Long> laboratorioIds) {
        List<Laboratorio> laboratorios = laboratorioRepository.findAllById(laboratorioIds);
        return estoqueRepository.listarResumoPorProdutosDosLaboratorios(laboratorios);
    }

    public List<EstoqueProdutoDTO> listarResumoPorProdutosDosDepartamentosId(List<Long> departamentoIds) {
        List<Departamento> departamentos = departamentoRepository.findAllById(departamentoIds);
        return estoqueRepository.listarResumoPorProdutosDosDepartamentos(departamentos);
    }


    @Override
    protected JpaRepository<Estoque, Long> getRepository() {
        return estoqueRepository;
    }
}
