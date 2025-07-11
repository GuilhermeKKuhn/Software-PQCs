package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.*;
import br.edu.utfpr.pb.pqcs.server.model.*;
import br.edu.utfpr.pb.pqcs.server.repository.*;
import br.edu.utfpr.pb.pqcs.server.service.AuthService;
import br.edu.utfpr.pb.pqcs.server.service.ImovimentacaoService;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MovimentacaoServiceImpl extends CrudServiceImpl<Movimentacao, Long> implements ImovimentacaoService{

    private final MovimentacaoRepository movimentacaoRepository;
    private final EstoqueRepository estoqueRepository;
    private final ProdutoQuimicoRepository produtoRepository;
    private final LaboratorioRepository laboratorioRepository;
    private final NotaFiscalRepository notaFiscalRepository;
    private final AuthService authService;
    private final ModelMapper modelMapper;
    private final FornecedorRepository fornecedorRepository;
    private final ItensNotaFiscalRepository itensNotaFiscalRepository;
    private final DepartamentoRepository departamentoRepository;

    public MovimentacaoServiceImpl(MovimentacaoRepository movimentacaoRepository, EstoqueRepository estoqueRepository, ProdutoQuimicoRepository produtoRepository,
                                   LaboratorioRepository laboratorioRepository, NotaFiscalRepository notaFiscalRepository, AuthService authService, ModelMapper modelMapper,
                                   FornecedorRepository fornecedorRepository,ItensNotaFiscalRepository itensNotaFiscalRepository, DepartamentoRepository departamentoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.notaFiscalRepository = notaFiscalRepository;
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.fornecedorRepository = fornecedorRepository;
        this.itensNotaFiscalRepository = itensNotaFiscalRepository;
        this.departamentoRepository = departamentoRepository;
    }


    public List<MovimentacaoDTO> realizarMovimentacoes(MovimentacaoDTO dto) {
        if (dto.getTipo() == null) {
            throw new RuntimeException("Tipo da movimentação deve ser informado.");
        }

        TipoMovimentacao tipo = TipoMovimentacao.valueOf(dto.getTipo());
        User user = authService.getUsuarioLogado();
        MotivoSaida motivo = null;
        if (tipo == TipoMovimentacao.SAIDA) {
            if (dto.getMotivoSaida() == null) {
                throw new RuntimeException("Motivo da saída é obrigatório.");
            }
            motivo = MotivoSaida.valueOf(dto.getMotivoSaida());
        }
        if (!user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR) && tipo != TipoMovimentacao.SAIDA) {
            throw new RuntimeException("Você só pode realizar movimentações do tipo SAÍDA.");
        }
        if (!user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR)) {
            Long labOrigemId = dto.getLaboratorioOrigem() != null ? dto.getLaboratorioOrigem().getId() : null;
            if (labOrigemId == null) {
                throw new RuntimeException("Laboratório de origem é obrigatório para movimentação do tipo SAÍDA.");
            }
            boolean autorizado = false;
            if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_LABORATORIO)) {
                autorizado = laboratorioRepository.findAllByResponsavelId(user.getId())
                        .stream()
                        .anyMatch(lab -> lab.getId().equals(labOrigemId));
            } else if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_DEPARTAMENTO)) {
                autorizado = departamentoRepository.findAllByResponsavelId(user.getId())
                        .stream()
                        .flatMap(dep -> laboratorioRepository.findAllByResponsavelId(dep.getId()).stream())
                        .anyMatch(lab -> lab.getId().equals(labOrigemId));
            }

            if (!autorizado) {
                throw new RuntimeException("Você não tem permissão para movimentar produtos deste laboratório.");
            }
        }

        validarLaboratorios(dto, tipo);

        NotaFiscal notaFiscal = tipo == TipoMovimentacao.ENTRADA ? criarNotaFiscalSeNecessario(dto) : null;
        Laboratorio origem = buscarLaboratorio(dto.getLaboratorioOrigem());
        Laboratorio destino = buscarLaboratorio(dto.getLaboratorioDestino());

        return criarMovimentacoes(dto.getItens(), tipo, origem, destino, notaFiscal, motivo);

    }


    private void validarLaboratorios(MovimentacaoDTO dto, TipoMovimentacao tipo) {
        if ((tipo == TipoMovimentacao.ENTRADA || tipo == TipoMovimentacao.TRANSFERENCIA) && (dto.getLaboratorioDestino() == null || dto.getLaboratorioDestino().getId() == null)) {
            throw new RuntimeException("Laboratório de destino é obrigatório.");
        }
        if (tipo == TipoMovimentacao.TRANSFERENCIA && (dto.getLaboratorioOrigem() == null || dto.getLaboratorioOrigem().getId() == null)) {
            throw new RuntimeException("Laboratório de origem é obrigatório para transferência.");
        }
        if (tipo == TipoMovimentacao.TRANSFERENCIA && dto.getLaboratorioOrigem().getId().equals(dto.getLaboratorioDestino().getId())) {
            throw new RuntimeException("Laboratório de origem e destino devem ser diferentes.");
        }
    }

    private NotaFiscal criarNotaFiscalSeNecessario(MovimentacaoDTO dto) {
        if (dto.getNotaFiscal() == null || dto.getNotaFiscal().getFornecedor() == null || dto.getNotaFiscal().getFornecedor().getId() == null) {
            throw new RuntimeException("Fornecedor e nota fiscal são obrigatórios para entrada.");
        }

        if (dto.getNotaFiscal().getId() != null) {
            return notaFiscalRepository.findById(dto.getNotaFiscal().getId())
                    .orElseThrow(() -> new RuntimeException("Nota fiscal não encontrada."));
        }

        NotaFiscal novaNota = new NotaFiscal();
        novaNota.setNumeroNotaFiscal(dto.getNotaFiscal().getNumeroNotaFiscal());
        novaNota.setDataRecebimento(dto.getNotaFiscal().getDataRecebimento());
        novaNota.setFornecedor(
                fornecedorRepository.findById(dto.getNotaFiscal().getFornecedor().getId())
                        .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."))
        );

        return notaFiscalRepository.save(novaNota);
    }

    private Laboratorio buscarLaboratorio(LaboratorioDTO labDTO) {
        return labDTO != null && labDTO.getId() != null
                ? laboratorioRepository.findById(labDTO.getId()).orElse(null)
                : null;
    }

    private List<MovimentacaoDTO> criarMovimentacoes(List<ItemMovimentacaoDTO> itens, TipoMovimentacao tipo, Laboratorio origem, Laboratorio destino, NotaFiscal notaFiscal, MotivoSaida motivoSaida) {
        List<MovimentacaoDTO> result = new ArrayList<>();

        for (ItemMovimentacaoDTO item : itens) {
            ProdutoQuimico produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

            LocalDate validade = null;
            LocalDate fabricacao = null;

            // Se for TRANSFERENCIA, pega validade e nota da origem
            if (tipo == TipoMovimentacao.TRANSFERENCIA) {
                Estoque estoqueOrigem = estoqueRepository.findByProdutoAndLaboratorioAndLote(produto, origem, item.getLote())
                        .orElseThrow(() -> new RuntimeException("Estoque de origem não encontrado."));

                validade = estoqueOrigem.getDataValidade();
                fabricacao = estoqueOrigem.getDataFabricacao();
                notaFiscal = estoqueOrigem.getNotaFiscal();
            }

            if (tipo == TipoMovimentacao.ENTRADA && notaFiscal != null) {
                if (item.getValidade() == null || item.getFabricacao() == null) {
                    throw new RuntimeException("Data de fabricação e validade devem ser informadas na entrada.");
                }
                validade = item.getValidade();
                fabricacao = item.getFabricacao();
            }

            if (tipo == TipoMovimentacao.ENTRADA) {
                criarItemNotaFiscal(notaFiscal, produto, item);
            }
            Movimentacao movimentacao = criarMovimentacao(
                    item, produto, origem, destino, notaFiscal, validade, fabricacao, tipo, motivoSaida
            );
            atualizarEstoque(movimentacao);

            movimentacaoRepository.save(movimentacao);
            result.add(toDTO(movimentacao));
        }

        return result;
    }

    /*public void realizarMovimentacoesPorSolicitacao(Long laboratorioOrigemId, Laboratorio destino, ItemSolicitacao item) {
        if (item.getLoteSelecionado() == null || item.getQuantidadeAprovada() == null || item.getQuantidadeAprovada() <= 0) {
            throw new RuntimeException("Lote e quantidade válida devem estar definidos para aprovar item.");
        }

        Laboratorio origem = laboratorioRepository.findById(laboratorioOrigemId)
                .orElseThrow(() -> new RuntimeException("Laboratório de origem não encontrado."));

        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setTipo(TipoMovimentacao.TRANSFERENCIA.name());

        dto.setLaboratorioOrigem(new LaboratorioDTO());
        dto.getLaboratorioOrigem().setId(origem.getId());

        dto.setLaboratorioDestino(new LaboratorioDTO());
        dto.getLaboratorioDestino().setId(destino.getId());

        ItemMovimentacaoDTO itemMov = new ItemMovimentacaoDTO();
        itemMov.setProdutoId(item.getProduto().getId());
        itemMov.setLote(item.getLoteSelecionado());
        itemMov.setQuantidade(item.getQuantidadeAprovada().doubleValue());

        dto.setItens(List.of(itemMov));

        realizarMovimentacoes(dto);
    }*/



    private void criarItemNotaFiscal(NotaFiscal nf, ProdutoQuimico produto, ItemMovimentacaoDTO item) {
        ItensNotaFiscal inf = new ItensNotaFiscal();
        inf.setQuantidade(item.getQuantidade().floatValue());
        inf.setData(nf.getDataRecebimento());
        inf.setLote(item.getLote());
        inf.setProdutoQuimico(produto);
        inf.setNotaFiscal(nf);
        itensNotaFiscalRepository.save(inf);
    }

    private Movimentacao criarMovimentacao(ItemMovimentacaoDTO item, ProdutoQuimico produto, Laboratorio origem, Laboratorio destino, NotaFiscal nf, LocalDate validade, LocalDate fabricacao, TipoMovimentacao tipo, MotivoSaida motivo) {
        Movimentacao m = new Movimentacao();
        m.setProduto(produto);
        m.setLaboratorioOrigem(origem);
        m.setLaboratorioDestino(destino);
        m.setQuantidade(item.getQuantidade());
        m.setTipoMovimentacao(tipo);
        m.setDataMovimentacao(LocalDateTime.now());
        m.setLote(item.getLote());
        m.setNotaFiscal(nf);
        m.setUsuario(authService.getUsuarioLogado());
        m.setValidade(validade);
        m.setFabricacao(fabricacao);
        m.setMotivoSaida(motivo);

        return m;
    }


    private void atualizarEstoque(Movimentacao mov) {
        ProdutoQuimico produto = mov.getProduto();
        Laboratorio origem = mov.getLaboratorioOrigem();
        Laboratorio destino = mov.getLaboratorioDestino();
        String lote = mov.getLote();
        Double quantidade = mov.getQuantidade();

        switch (mov.getTipoMovimentacao()) {
            case ENTRADA -> {
                processarEntrada(produto, destino, mov);
            }

            case SAIDA -> {
                processarSaida(produto, origem, lote, quantidade);
            }

            case TRANSFERENCIA -> {
                // Remove do estoque de origem (lote existente)
                processarSaida(produto, origem, lote, quantidade);
                // Adiciona no destino, mantendo validade e nota fiscal — já setados na Movimentacao
                processarEntrada(produto, destino, mov);
            }
        }
    }

    private void processarEntrada(ProdutoQuimico produto, Laboratorio laboratorio, Movimentacao mov) {
        if (laboratorio == null) throw new RuntimeException("Laboratório de destino não informado.");

        Estoque estoque = estoqueRepository.findByProdutoAndLaboratorioAndLote(produto, laboratorio, mov.getLote())
                .orElseGet(() -> {
                    Estoque novo = new Estoque();
                    novo.setProduto(produto);
                    novo.setLaboratorio(laboratorio);
                    novo.setLote(mov.getLote());
                    novo.setQuantidade(0.0F);
                    novo.setNotaFiscal(mov.getNotaFiscal());
                    novo.setDataFabricacao(mov.getFabricacao());
                    novo.setDataValidade(mov.getValidade());
                    return novo;
                });
        estoque.setQuantidade((float) (estoque.getQuantidade() + mov.getQuantidade()));

        estoqueRepository.save(estoque);
    }


    private void processarSaida(ProdutoQuimico produto, Laboratorio laboratorio, String lote, Double quantidade) {
        if (laboratorio == null) throw new RuntimeException("Laboratório de origem não informado.");

        Estoque estoque = estoqueRepository.findByProdutoAndLaboratorioAndLote(produto, laboratorio, lote)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o lote informado."));

        if (estoque.getQuantidade() < quantidade) {
            throw new RuntimeException("Quantidade insuficiente no estoque para o lote informado.");
        }

        estoque.setQuantidade((float) (estoque.getQuantidade() - quantidade));
        estoqueRepository.save(estoque);
    }


    public List<MovimentacaoDTO> listar() {
        User user = authService.getUsuarioLogado();

        if (user.getTipoPerfil() == TipoPerfil.ADMINISTRADOR) {
            return movimentacaoRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .toList();
        }

        if (user.getTipoPerfil() == TipoPerfil.RESPONSAVEL_LABORATORIO) {
            List<Long> labsIds = laboratorioRepository.findAllByResponsavelId(user.getId())
                    .stream()
                    .map(Laboratorio::getId)
                    .toList();

            List<Movimentacao> movimentacoes = movimentacaoRepository
                    .findAllByLaboratorioOrigem_IdInOrLaboratorioDestino_IdIn(labsIds, labsIds);

            return movimentacoes.stream().map(this::toDTO).toList();
        }

        if (user.getTipoPerfil() == TipoPerfil.RESPONSAVEL_DEPARTAMENTO) {
            List<Long> departamentosIds = departamentoRepository.findAllByResponsavelId(user.getId())
                    .stream()
                    .map(dep -> dep.getId())
                    .toList();

            List<Long> labsIds = laboratorioRepository.findAllByDepartamento_IdIn(departamentosIds)
                    .stream()
                    .map(Laboratorio::getId)
                    .toList();

            List<Movimentacao> movimentacoes = movimentacaoRepository
                    .findAllByLaboratorioOrigem_IdInOrLaboratorioDestino_IdIn(labsIds, labsIds);

            return movimentacoes.stream().map(this::toDTO).toList();
        }

        return Collections.emptyList();
    }




    public MovimentacaoDTO buscarPorId(Long id) {
        Movimentacao movimentacao = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada."));
        return toDTO(movimentacao);
    }

    private MovimentacaoDTO toDTO(Movimentacao m) {
        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setId(m.getId());
        dto.setTipo(m.getTipoMovimentacao().name());
        dto.setDataMovimentacao(m.getDataMovimentacao());

        // Nota Fiscal
        if (m.getNotaFiscal() != null) {
            NotaFiscal nf = m.getNotaFiscal();
            Fornecedor fornecedor = nf.getFornecedor();

            NotaFiscalDTO nfDTO = new NotaFiscalDTO();
            nfDTO.setId(nf.getId());
            nfDTO.setNumeroNotaFiscal(nf.getNumeroNotaFiscal());
            nfDTO.setDataRecebimento(nf.getDataRecebimento());

            FornecedorDTO fDTO = new FornecedorDTO();
            fDTO.setId(fornecedor.getId());
            fDTO.setRazaoSocial(fornecedor.getRazaoSocial());
            fDTO.setCnpj(fornecedor.getCnpj());

            nfDTO.setFornecedor(fDTO);
            dto.setNotaFiscal(nfDTO);
        }

        // Laboratório Origem
        if (m.getLaboratorioOrigem() != null) {
            Laboratorio lab = m.getLaboratorioOrigem();
            LaboratorioDTO labDTO = new LaboratorioDTO();
            labDTO.setId(lab.getId());
            labDTO.setNomeLaboratorio(lab.getNomeLaboratorio());
            labDTO.setSala(lab.getSala());

            DepartamentoDTO depDTO = new DepartamentoDTO();
            depDTO.setId(lab.getDepartamento().getId());
            depDTO.setNomeDepartamento(lab.getDepartamento().getNomeDepartamento());

            labDTO.setDepartamento(depDTO);
            dto.setLaboratorioOrigem(labDTO);
        }

        // Laboratório Destino
        if (m.getLaboratorioDestino() != null) {
            Laboratorio lab = m.getLaboratorioDestino();

            // Monta o DTO do Departamento
            DepartamentoDTO depDTO = new DepartamentoDTO();
            depDTO.setId(lab.getDepartamento().getId());
            depDTO.setNomeDepartamento(lab.getDepartamento().getNomeDepartamento());

            // Monta o DTO do Laboratório
            LaboratorioDTO labDTO = new LaboratorioDTO();
            labDTO.setId(lab.getId());
            labDTO.setNomeLaboratorio(lab.getNomeLaboratorio());
            labDTO.setSala(lab.getSala());
            labDTO.setDepartamento(depDTO); // agora sim, objeto completo

            dto.setLaboratorioDestino(labDTO);
        }
        if (m.getUsuario() != null) {
            UserDTO uDTO = new UserDTO();
            uDTO.setId(m.getUsuario().getId());
            uDTO.setName(m.getUsuario().getName());
            dto.setUsuario(uDTO);
        }
        if (m.getMotivoSaida() != null) {
            dto.setMotivoSaida(m.getMotivoSaida().name());
        }

        ItemMovimentacaoDTO itemDTO = new ItemMovimentacaoDTO();
        itemDTO.setProdutoId(m.getProduto().getId());
        itemDTO.setNomeProduto(m.getProduto().getNome());
        itemDTO.setQuantidade(m.getQuantidade());
        itemDTO.setLote(m.getLote());
        itemDTO.setPreco(null); // se não salvar preço aqui

        dto.setItens(List.of(itemDTO));

        return dto;
    }



    @Override
    protected JpaRepository<Movimentacao, Long> getRepository() {
        return movimentacaoRepository;
    }
}
