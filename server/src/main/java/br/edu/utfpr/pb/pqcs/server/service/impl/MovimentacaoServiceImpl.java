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
        // === Validação básica do tipo ===
        if (dto.getTipo() == null) {
            throw new RuntimeException("Tipo da movimentação deve ser informado.");
        }

        TipoMovimentacao tipo = TipoMovimentacao.valueOf(dto.getTipo());

        // === Validação de laboratórios ===
        if ((tipo == TipoMovimentacao.ENTRADA || tipo == TipoMovimentacao.TRANSFERENCIA)) {
            if (dto.getLaboratorioDestino() == null || dto.getLaboratorioDestino().getId() == null) {
                throw new RuntimeException("Laboratório de destino é obrigatório para entrada ou transferência.");
            }
        }

        if (tipo == TipoMovimentacao.TRANSFERENCIA) {
            if (dto.getLaboratorioOrigem() == null || dto.getLaboratorioOrigem().getId() == null) {
                throw new RuntimeException("Laboratório de origem é obrigatório para transferência.");
            }
        }

        // === Validação de nota fiscal (somente para ENTRADA) ===
        NotaFiscal notaFiscal = null;
        if (tipo == TipoMovimentacao.ENTRADA) {
            if (dto.getNotaFiscal() == null || dto.getNotaFiscal().getFornecedor() == null || dto.getNotaFiscal().getFornecedor().getId() == null) {
                throw new RuntimeException("Fornecedor e nota fiscal são obrigatórios para entrada.");
            }

            if (dto.getNotaFiscal().getId() == null) {
                // Criar nova nota
                NotaFiscal novaNota = new NotaFiscal();
                novaNota.setNumeroNotaFiscal(dto.getNotaFiscal().getNumeroNotaFiscal());
                novaNota.setDataRecebimento(dto.getNotaFiscal().getDataRecebimento());

                Long fornecedorId = dto.getNotaFiscal().getFornecedor().getId();
                Fornecedor fornecedor = fornecedorRepository.findById(fornecedorId)
                        .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));
                novaNota.setFornecedor(fornecedor);

                notaFiscal = notaFiscalRepository.save(novaNota);
            } else {
                // Buscar nota existente
                notaFiscal = notaFiscalRepository.findById(dto.getNotaFiscal().getId())
                        .orElseThrow(() -> new RuntimeException("Nota fiscal não encontrada."));
            }
        }

        // === Carregar laboratórios ===
        Laboratorio origem = dto.getLaboratorioOrigem() != null && dto.getLaboratorioOrigem().getId() != null
                ? laboratorioRepository.findById(dto.getLaboratorioOrigem().getId()).orElse(null)
                : null;

        Laboratorio destino = dto.getLaboratorioDestino() != null && dto.getLaboratorioDestino().getId() != null
                ? laboratorioRepository.findById(dto.getLaboratorioDestino().getId()).orElse(null)
                : null;

        List<MovimentacaoDTO> movimentacoesFeitas = new ArrayList<>();

        for (ItemMovimentacaoDTO item : dto.getItens()) {
            ProdutoQuimico produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

            // === Calcular validade (caso ENTRADA) ===
            LocalDate validade = null;
            if (tipo == TipoMovimentacao.ENTRADA && produto.getValidade() != null && notaFiscal != null) {
                validade = notaFiscal.getDataRecebimento().plusDays(produto.getValidade());
            }

            // === Criar item da nota fiscal se for ENTRADA ===
            if (tipo == TipoMovimentacao.ENTRADA) {
                ItensNotaFiscal itensNota = new ItensNotaFiscal();
                itensNota.setQuantidade(item.getQuantidade().floatValue());
                itensNota.setPreco(item.getPreco() != null ? item.getPreco().floatValue() : 0f);
                itensNota.setData(notaFiscal.getDataRecebimento());
                itensNota.setLote(item.getLote());
                itensNota.setProdutoQuimico(produto);
                itensNota.setNotaFiscal(notaFiscal);
                itensNotaFiscalRepository.save(itensNota);
            }

            // === Criar movimentação ===
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

            // === Atualiza estoque ===
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

    private MovimentacaoDTO toDTO(Movimentacao m) {
        MovimentacaoDTO dto = new MovimentacaoDTO();
        dto.setId(m.getId());
        dto.setTipo(m.getTipoMovimentacao().name());
        dto.setQuantidade(m.getQuantidade());
        dto.setLote(m.getLote());
        dto.setValidade(m.getValidade());
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

        // Usuário
        if (m.getUsuario() != null) {
            UserDTO uDTO = new UserDTO();
            uDTO.setId(m.getUsuario().getId());
            uDTO.setName(m.getUsuario().getName());
            dto.setUsuario(uDTO);
        }

        // Item único (como você tá salvando um por vez)
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
