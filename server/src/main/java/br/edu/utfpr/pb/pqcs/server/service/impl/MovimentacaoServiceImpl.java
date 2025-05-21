package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.MovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.model.*;
import br.edu.utfpr.pb.pqcs.server.repository.*;
import br.edu.utfpr.pb.pqcs.server.service.ImovimentacaoService;
import br.edu.utfpr.pb.pqcs.server.util.UserUtil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoServiceImpl extends CrudServiceImpl<Movimentacao, Long> implements ImovimentacaoService{

    private final MovimentacaoRepository movimentacaoRepository;
    private final EstoqueRepository estoqueRepository;
    private final ProdutoQuimicoRepository produtoRepository;
    private final LaboratorioRepository laboratorioRepository;
    private final NotaFiscalRepository notaFiscalRepository;
    private UserUtil usuarioUtil;

    public MovimentacaoServiceImpl(MovimentacaoRepository movimentacaoRepository, EstoqueRepository estoqueRepository, ProdutoQuimicoRepository produtoRepository,
                                   LaboratorioRepository laboratorioRepository, NotaFiscalRepository notaFiscalRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.notaFiscalRepository = notaFiscalRepository;
    }

    public MovimentacaoDTO realizarMovimentacao(MovimentacaoDTO dto) {
        ProdutoQuimico produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Laboratorio origem = dto.getLaboratorioOrigemId() != null ?
                laboratorioRepository.findById(dto.getLaboratorioOrigemId())
                        .orElse(null) : null;

        Laboratorio destino = dto.getLaboratorioDestinoId() != null ?
                laboratorioRepository.findById(dto.getLaboratorioDestinoId())
                        .orElse(null) : null;

        NotaFiscal notaFiscal = dto.getNotaFiscalId() != null ?
                notaFiscalRepository.findById(dto.getNotaFiscalId())
                        .orElse(null) : null;

        Long usuarioId = dto.getUsuarioId() != null
                ? dto.getUsuarioId()
                : usuarioUtil.getUsuarioIdLogado();

        TipoMovimentacao tipo = TipoMovimentacao.valueOf(dto.getTipo());

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setProduto(produto);
        movimentacao.setLaboratorioOrigem(origem);
        movimentacao.setLaboratorioDestino(destino);
        movimentacao.setQuantidade(dto.getQuantidade());
        movimentacao.setTipoMovimentacao(tipo);
        movimentacao.setDataMovimentacao(LocalDateTime.now());
        movimentacao.setLote(dto.getLote());
        movimentacao.setNotaFiscal(notaFiscal);
        movimentacao.setUsuarioId(usuarioId);

        atualizarEstoque(movimentacao);

        movimentacaoRepository.save(movimentacao);

        dto.setId(movimentacao.getId());
        dto.setData(movimentacao.getDataMovimentacao());
        return dto;
    }

    private void atualizarEstoque(Movimentacao mov) {
        ProdutoQuimico produto = mov.getProduto();

        switch (mov.getTipoMovimentacao()) {
            case ENTRADA:
                processarEntrada(produto, mov.getLaboratorioDestino(), mov);
                break;
            case SAIDA:
                processarSaida(produto, mov.getLaboratorioOrigem(), mov.getQuantidade());
                break;
            case TRANSFERENCIA:
                processarSaida(produto, mov.getLaboratorioOrigem(), mov.getQuantidade());
                processarEntrada(produto, mov.getLaboratorioDestino(), mov);
                break;
        }
    }

    private void processarEntrada(ProdutoQuimico produto, Laboratorio laboratorio, Movimentacao mov) {
        if (laboratorio == null) throw new RuntimeException("Laboratório de destino não informado.");

        Estoque estoque = estoqueRepository.findByProdutoAndLaboratorioAndLote(
                produto, laboratorio, mov.getLote()
        ).orElseGet(() -> {
            Estoque novo = new Estoque();
            novo.setProduto(produto);
            novo.setLaboratorio(laboratorio);
            novo.setLote(mov.getLote());
            novo.setQuantidade(0.0F);
            novo.setNotaFiscal(mov.getNotaFiscal());
            return novo;
        });

        estoque.setQuantidade((float) (estoque.getQuantidade() + mov.getQuantidade()));
        estoqueRepository.save(estoque);
    }

    private void processarSaida(ProdutoQuimico produto, Laboratorio laboratorio, Double quantidade) {
        if (laboratorio == null) throw new RuntimeException("Laboratório de origem não informado.");

        List<Estoque> estoques = estoqueRepository
                .findByProdutoAndLaboratorioOrderByValidadeAsc(produto, laboratorio);

        double restante = quantidade;

        for (Estoque estoque : estoques) {
            if (estoque.getQuantidade() <= 0) continue;

            double consumir = Math.min(estoque.getQuantidade(), restante);
            estoque.setQuantidade((float) (estoque.getQuantidade() - consumir));
            restante -= consumir;
            estoqueRepository.save(estoque);

            if (restante <= 0) break;
        }

        if (restante > 0) {
            throw new RuntimeException("Estoque insuficiente para o produto.");
        }
    }

    public List<MovimentacaoDTO> listar() {
        return movimentacaoRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public MovimentacaoDTO buscarPorId(Long id) {
        Movimentacao movimentacao = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));
        return toDTO(movimentacao);
    }

    private MovimentacaoDTO toDTO(Movimentacao mov) {
        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setId(mov.getId());
        dto.setProdutoId(mov.getProduto().getId());
        dto.setLaboratorioOrigemId(mov.getLaboratorioOrigem() != null ? mov.getLaboratorioOrigem().getId() : null);
        dto.setLaboratorioDestinoId(mov.getLaboratorioDestino() != null ? mov.getLaboratorioDestino().getId() : null);
        dto.setQuantidade(mov.getQuantidade());
        dto.setTipo(mov.getTipoMovimentacao().name());
        dto.setLote(mov.getLote());
        dto.setNotaFiscalId(mov.getNotaFiscal() != null ? mov.getNotaFiscal().getId() : null);
        dto.setData(mov.getDataMovimentacao());
        return dto;
    }

    @Override
    protected JpaRepository<Movimentacao, Long> getRepository() {
        return movimentacaoRepository;
    }
}
