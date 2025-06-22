package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.*;
import br.edu.utfpr.pb.pqcs.server.model.*;
import br.edu.utfpr.pb.pqcs.server.repository.DepartamentoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.repository.ProdutoQuimicoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.SolicitacaoRepository;
import br.edu.utfpr.pb.pqcs.server.service.AuthService;
import br.edu.utfpr.pb.pqcs.server.service.ISolicitacaoService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Service
public class SolicitacaoServiceImpl extends CrudServiceImpl<Solicitacao, Long>
        implements ISolicitacaoService {

    private final ProdutoQuimicoRepository produtoRepo;
    private final SolicitacaoRepository solicitacaoRepo;
    private final LaboratorioRepository labRepo;
    private final AuthService authService;
    private final MovimentacaoServiceImpl movimentacaoService;
    private final DepartamentoRepository departamentoRepo;

    public SolicitacaoServiceImpl(
            SolicitacaoRepository solicitacaoRepo,
            ProdutoQuimicoRepository produtoRepo,
            LaboratorioRepository labRepo,
            AuthService authService,
            MovimentacaoServiceImpl movimentacaoService,
            DepartamentoRepository departamentoRepo) {
        this.solicitacaoRepo = solicitacaoRepo;
        this.produtoRepo = produtoRepo;
        this.labRepo = labRepo;
        this.authService = authService;
        this.movimentacaoService = movimentacaoService;
        this.departamentoRepo = departamentoRepo;
    }

    public List<SolicitacaoDTO> listarTodasVisiveis() {
        User user = authService.getUsuarioLogado();

        List<Solicitacao> solicitacoes;

        if (user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR)) {
            solicitacoes = solicitacaoRepo.findAll();
        } else if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_LABORATORIO)) {
            List<Long> labs = labRepo.findAllByResponsavelId(user.getId()).stream()
                    .map(Laboratorio::getId).toList();
            solicitacoes = solicitacaoRepo.findAllByLaboratorioIdIn(labs);
        } else if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_DEPARTAMENTO)) {
            List<Long> depIds = departamentoRepo.findAllByResponsavelId(user.getId()).stream()
                    .map(Departamento::getId).toList();

            List<Long> labs = labRepo.findAll().stream()
                    .filter(lab -> lab.getDepartamento() != null && depIds.contains(lab.getDepartamento().getId()))
                    .map(Laboratorio::getId).toList();

            solicitacoes = solicitacaoRepo.findAllByLaboratorioIdIn(labs);
        } else {
            solicitacoes = solicitacaoRepo.findAllBySolicitanteId(user.getId());
        }

        return solicitacoes.stream().map(this::toDTO).toList();
    }

    public SolicitacaoDTO criar(SolicitacaoDTO dto) {
        User solicitante = authService.getUsuarioLogado();
        Laboratorio lab = labRepo.findById(dto.getLaboratorioId())
                .orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setSolicitante(solicitante);
        solicitacao.setDataSolicitacao(LocalDate.now());
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
        solicitacao.setLaboratorio(lab);

        List<ItemSolicitacao> itens = new ArrayList<>();

        for (ItemSolicitacaoDTO itemDto : dto.getItens()) {
            ProdutoQuimico produto = produtoRepo.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            ItemSolicitacao item = ItemSolicitacao.builder()
                    .produto(produto)
                    .quantidadeSolicitada(itemDto.getQuantidadeSolicitada())
                    .solicitacao(solicitacao)
                    .build();

            itens.add(item);
        }
        solicitacao.setItens(itens);
        solicitacao = solicitacaoRepo.save(solicitacao);

        return toDTO(solicitacao);
    }



    public List<SolicitacaoDTO> listarPendentes() {
        User user = authService.getUsuarioLogado();

        List<Solicitacao> solicitacoes;

        if (user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR)) {
            solicitacoes = solicitacaoRepo.findAllByStatus(StatusSolicitacao.PENDENTE);
        } else if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_LABORATORIO)) {
            List<Long> labs = labRepo.findAllByResponsavelId(user.getId()).stream()
                    .map(Laboratorio::getId).toList();
            solicitacoes = solicitacaoRepo.findAllByLaboratorioIdInAndStatus(labs, StatusSolicitacao.PENDENTE);
        } else if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_DEPARTAMENTO)) {
            List<Long> depIds = departamentoRepo.findAllByResponsavelId(user.getId()).stream()
                    .map(Departamento::getId).toList();

            List<Long> labs = labRepo.findAll().stream()
                    .filter(lab -> lab.getDepartamento() != null && depIds.contains(lab.getDepartamento().getId()))
                    .map(Laboratorio::getId).toList();

            solicitacoes = solicitacaoRepo.findAllByLaboratorioIdInAndStatus(labs, StatusSolicitacao.PENDENTE);
        } else {
            solicitacoes = List.of();
        }

        return solicitacoes.stream().map(this::toDTO).toList();
    }

    /*public void aprovar(Long id, List<ItemSolicitacaoDTO> itensDTO) {
        User user = authService.getUsuarioLogado();

        if (!user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR)) {
            throw new RuntimeException("Apenas administradores podem aprovar solicitações.");
        }

        Solicitacao solicitacao = solicitacaoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        for (ItemSolicitacaoDTO itemDTO : itensDTO) {
            ItemSolicitacao item = solicitacao.getItens().stream()
                    .filter(i -> i.getId().equals(itemDTO.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Item não encontrado na solicitação"));

            item.setQuantidadeAprovada(itemDTO.getQuantidadeAprovada());
            item.setLoteSelecionado(itemDTO.getLoteSelecionado());
        }

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        solicitacaoRepo.save(solicitacao);

        for (ItemSolicitacaoDTO itemDTO : itensDTO) {
            if (itemDTO.getQuantidadeAprovada() != null && itemDTO.getQuantidadeAprovada() > 0) {
                ItemSolicitacao item = new ItemSolicitacao();
                item.setId(itemDTO.getId());
                item.setQuantidadeAprovada(itemDTO.getQuantidadeAprovada());
                item.setLoteSelecionado(itemDTO.getLoteSelecionado());
                item.setProduto(produtoRepo.findById(itemDTO.getProdutoId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado")));

                movimentacaoService.realizarMovimentacoesPorSolicitacao(
                        itemDTO.getLaboratorioOrigemId(),
                        solicitacao.getLaboratorio(),
                        item
                );
            }
        }

    }*/

    public MovimentacaoDTO gerarMovimentacaoPreenchida(Long solicitacaoId) {
        Solicitacao solicitacao = solicitacaoRepo.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));

        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setTipo(TipoMovimentacao.TRANSFERENCIA.name());

        LaboratorioDTO destino = new LaboratorioDTO();
        destino.setId(solicitacao.getLaboratorio().getId());
        destino.setNomeLaboratorio(solicitacao.getLaboratorio().getNomeLaboratorio());
        dto.setLaboratorioDestino(destino);

        List<ItemMovimentacaoDTO> itens = solicitacao.getItens().stream().map(item -> {
            ItemMovimentacaoDTO i = new ItemMovimentacaoDTO();
            i.setIdSolicitacaoItem(item.getId());
            i.setProdutoId(item.getProduto().getId());
            i.setNomeProduto(item.getProduto().getNome());
            i.setQuantidade(item.getQuantidadeSolicitada().doubleValue());
            i.setLote(null);
            return i;
        }).toList();

        dto.setItens(itens);
        return dto;
    }


    private SolicitacaoDTO toDTO(Solicitacao s) {
        return new SolicitacaoDTO(
                s.getId(),
                s.getLaboratorio().getId(),
                s.getLaboratorio(),
                s.getSolicitante().getName(),
                s.getStatus().name(),
                s.getDataSolicitacao(),
                s.getItens().stream().map(i -> new ItemSolicitacaoDTO(
                        i.getId(),
                        i.getProduto().getId(),
                        i.getQuantidadeSolicitada(),
                        i.getQuantidadeAprovada(),
                        i.getLoteSelecionado(),
                        null,
                        i.getProduto().getNome()
                )).toList()
        );
    }

    public void concluir(Long id) {
        Solicitacao solicitacao = solicitacaoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));
        solicitacao.setStatus(StatusSolicitacao.CONCLUIDA);
        solicitacaoRepo.save(solicitacao);
    }



    @Override
    protected JpaRepository<Solicitacao, Long> getRepository() {
        return solicitacaoRepo;
    }
}
