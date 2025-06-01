package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.ItemMovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.MovimentacaoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.NotaFiscalDTO;
import br.edu.utfpr.pb.pqcs.server.dto.UserDTO;
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

    public MovimentacaoServiceImpl(MovimentacaoRepository movimentacaoRepository, EstoqueRepository estoqueRepository, ProdutoQuimicoRepository produtoRepository,
                                   LaboratorioRepository laboratorioRepository, NotaFiscalRepository notaFiscalRepository, AuthService authService, ModelMapper modelMapper,
                                   FornecedorRepository fornecedorRepository,ItensNotaFiscalRepository itensNotaFiscalRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.estoqueRepository = estoqueRepository;
        this.produtoRepository = produtoRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.notaFiscalRepository = notaFiscalRepository;
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.fornecedorRepository = fornecedorRepository;
        this.itensNotaFiscalRepository = itensNotaFiscalRepository;
    }


    public List<MovimentacaoDTO> realizarMovimentacoes(MovimentacaoDTO dto) {
        // Salva a Nota Fiscal se vier nova
        NotaFiscal notaFiscal = null;
        if (dto.getNotaFiscal() != null && dto.getNotaFiscal().getId() == null) {
            // Cria uma nova nota fiscal
            NotaFiscal novaNota = new NotaFiscal();
            novaNota.setNumeroNotaFiscal(dto.getNotaFiscal().getNumeroNotaFiscal());
            novaNota.setDataRecebimento(dto.getNotaFiscal().getDataRecebimento());

            // Fornecedor deve existir
            Long fornecedorId = dto.getNotaFiscal().getFornecedor().getId();
            Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId)
                    .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado"));
            novaNota.setFornecedor(fornecedor);

            notaFiscal = notaFiscalRepository.save(novaNota);
        } else if (dto.getNotaFiscal() != null) {
            // Usar nota já existente
            notaFiscal = notaFiscalRepository.findById(dto.getNotaFiscal().getId())
                    .orElseThrow(() -> new RuntimeException("Nota Fiscal não encontrada"));
        }

        List<MovimentacaoDTO> movimentacoesFeitas = new ArrayList<>();

        for (ItemMovimentacaoDTO item : dto.getItens()) {
            ProdutoQuimico produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            Laboratorio origem = dto.getLaboratorioOrigemId() != null ?
                    laboratorioRepository.findById(dto.getLaboratorioOrigemId()).orElse(null) : null;

            Laboratorio destino = dto.getLaboratorioDestinoId() != null ?
                    laboratorioRepository.findById(dto.getLaboratorioDestinoId()).orElse(null) : null;

            TipoMovimentacao tipo = TipoMovimentacao.valueOf(dto.getTipo());

            // Calcular validade se for entrada
            LocalDate validade = null;
            if (tipo == TipoMovimentacao.ENTRADA && notaFiscal != null && produto.getValidade() != null) {
                validade = notaFiscal.getDataRecebimento().plusDays(produto.getValidade());
            }

            // Salva item na tb_itensnotafiscal se for ENTRADA
            if (tipo == TipoMovimentacao.ENTRADA) {
                ItensNotaFiscal itensNota = new ItensNotaFiscal();
                itensNota.setQuantidade(item.getQuantidade().floatValue());
                itensNota.setPreco(item.getPreco().floatValue());
                itensNota.setData(notaFiscal.getDataRecebimento());
                itensNota.setLote(item.getLote());
                itensNota.setProdutoQuimico(produto);
                itensNota.setNotaFiscal(notaFiscal);
                // Salva no repo de itens nota
                itensNotaFiscalRepository.save(itensNota);
            }

            Movimentacao movimentacao = new Movimentacao();
            movimentacao.setProduto(produto);
            movimentacao.setLaboratorioOrigem(origem);
            movimentacao.setLaboratorioDestino(destino);
            movimentacao.setQuantidade(item.getQuantidade());
            movimentacao.setTipoMovimentacao(tipo);
            movimentacao.setDataMovimentacao(LocalDateTime.now());
            movimentacao.setLote(item.getLote());
            movimentacao.setNotaFiscal(notaFiscal);
            movimentacao.setUsuario(authService.getUsuarioLogado());
            movimentacao.setValidade(validade);

            // Atualiza estoque para cada item
            atualizarEstoque(movimentacao);

            movimentacaoRepository.save(movimentacao);
            movimentacoesFeitas.add(toDTO(movimentacao));
        }

        return movimentacoesFeitas;
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
            novo.setValidade(mov.getValidade() != null ? mov.getValidade().atStartOfDay() : null);
            return novo;
        });

        estoque.setQuantidade((float) (estoque.getQuantidade() + mov.getQuantidade()));
        // Atualiza validade se for maior que o atual
        if (mov.getValidade() != null) {
            estoque.setValidade(mov.getValidade().atStartOfDay());
        }
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
        dto.setTipo(mov.getTipoMovimentacao().name());
        dto.setLaboratorioOrigemId(mov.getLaboratorioOrigem() != null ? mov.getLaboratorioOrigem().getId() : null);
        dto.setLaboratorioDestinoId(mov.getLaboratorioDestino() != null ? mov.getLaboratorioDestino().getId() : null);
        dto.setNotaFiscal(mov.getNotaFiscal() != null ? modelMapper.map(mov.getNotaFiscal(), NotaFiscalDTO.class) : null);


        ItemMovimentacaoDTO item = new ItemMovimentacaoDTO();
        item.setProdutoId(mov.getProduto().getId());
        item.setQuantidade(mov.getQuantidade());
        item.setLote(mov.getLote());
        // Se quiser o preço, teria que buscar dos ItensNotaFiscal

        List<ItemMovimentacaoDTO> itens = new ArrayList<>();
        itens.add(item);
        dto.setItens(itens);

        return dto;
    }

    @Override
    protected JpaRepository<Movimentacao, Long> getRepository() {
        return movimentacaoRepository;
    }
}
