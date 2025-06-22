package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.*;
import br.edu.utfpr.pb.pqcs.server.repository.FornecedorRepository;
import br.edu.utfpr.pb.pqcs.server.repository.MovimentacaoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.UserRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class RelatorioServiceImpl {

    private MovimentacaoRepository movimentacaoRepo;
    private FornecedorRepository fornecedorRepo;
    private UserRepository userRepo;

    public RelatorioServiceImpl(MovimentacaoRepository movimentacaoRepo, FornecedorRepository fornecedorRepo, UserRepository userRepo) {
        this.movimentacaoRepo = movimentacaoRepo;
        this.fornecedorRepo = fornecedorRepo;
        this.userRepo = userRepo;
    }

    public byte[] gerarRelatorioMovimentacoes(LocalDate inicio, LocalDate fim) throws IOException {
        List<Movimentacao> movimentacoes = movimentacaoRepo.findAllByDataMovimentacaoBetween(
                inicio.atStartOfDay(),
                fim.atTime(23, 59, 59)
        );

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Movimentações");

            String[] headers = {
                    "Data", "Tipo", "Produto ID", "Produto Nome", "CAS", "Concentração", "Densidade", "Estado Físico", "Característica",
                    "Quantidade", "Lote", "Fabricação", "Validade",
                    "Motivo Saída", "Lab Origem", "Lab Destino", "Usuário",
                    "NF Nº", "NF Data Recebimento", "Fornecedor"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Movimentacao mov : movimentacoes) {
                Row row = sheet.createRow(rowNum++);

                ProdutoQuimico p = mov.getProduto();

                row.createCell(0).setCellValue(mov.getDataMovimentacao().toString());
                row.createCell(1).setCellValue(mov.getTipoMovimentacao().name());

                row.createCell(2).setCellValue(p.getId());
                row.createCell(3).setCellValue(p.getNome());
                row.createCell(4).setCellValue(p.getCas());
                row.createCell(5).setCellValue(p.getConcentracao());
                row.createCell(6).setCellValue(p.getDensidade());
                row.createCell(7).setCellValue(p.getEstadoFisico());
                row.createCell(8).setCellValue(p.getCaracteristica());

                row.createCell(9).setCellValue(mov.getQuantidade());
                row.createCell(10).setCellValue(mov.getLote());
                row.createCell(11).setCellValue(mov.getFabricacao() != null ? mov.getFabricacao().toString() : "");
                row.createCell(12).setCellValue(mov.getValidade() != null ? mov.getValidade().toString() : "");
                row.createCell(13).setCellValue(mov.getMotivoSaida() != null ? mov.getMotivoSaida().name() : "");
                row.createCell(14).setCellValue(mov.getLaboratorioOrigem() != null ? mov.getLaboratorioOrigem().getNomeLaboratorio() : "");
                row.createCell(15).setCellValue(mov.getLaboratorioDestino() != null ? mov.getLaboratorioDestino().getNomeLaboratorio() : "");
                row.createCell(16).setCellValue(mov.getUsuario() != null ? mov.getUsuario().getName() : "");
                row.createCell(17).setCellValue(mov.getNotaFiscal() != null ? String.valueOf(mov.getNotaFiscal().getNumeroNotaFiscal()) : "");
                row.createCell(18).setCellValue(
                        mov.getNotaFiscal() != null && mov.getNotaFiscal().getDataRecebimento() != null
                                ? mov.getNotaFiscal().getDataRecebimento().toString() : ""
                );
                row.createCell(19).setCellValue(
                        mov.getNotaFiscal() != null && mov.getNotaFiscal().getFornecedor() != null
                                ? mov.getNotaFiscal().getFornecedor().getRazaoSocial() : ""
                );
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }


    public ByteArrayInputStream gerarRelatorioFornecedores(List<Fornecedor> fornecedores) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Fornecedores");

            String[] colunas = {
                    "ID", "Razão Social", "CNPJ", "Endereço", "Número",
                    "Cidade", "Estado", "Telefone", "Email", "Validade Licença"
            };

            Row header = sheet.createRow(0);
            for (int i = 0; i < colunas.length; i++) {
                header.createCell(i).setCellValue(colunas[i]);
            }

            int rowNum = 1;
            for (Fornecedor f : fornecedores) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(f.getId());
                row.createCell(1).setCellValue(f.getRazaoSocial());
                row.createCell(2).setCellValue(f.getCnpj());
                row.createCell(3).setCellValue(f.getEndereco());
                row.createCell(4).setCellValue(f.getNumero());
                row.createCell(5).setCellValue(f.getCidade());
                row.createCell(6).setCellValue(f.getEstado());
                row.createCell(7).setCellValue(f.getTelefone());
                row.createCell(8).setCellValue(f.getEmail());
                row.createCell(9).setCellValue(
                        f.getDataValidadeLicenca() != null ? f.getDataValidadeLicenca().toString() : ""
                );
            }

            for (int i = 0; i < colunas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream gerarRelatorioUsuarios() throws IOException {
        List<User> usuarios = userRepo.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Usuários");

            String[] headers = {"Nome", "E-mail", "SIAPE", "Perfil", "Ativo"};

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (User user : usuarios) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getName());
                row.createCell(1).setCellValue(user.getEmail());
                row.createCell(2).setCellValue(user.getSiape());
                row.createCell(3).setCellValue(user.getTipoPerfil().name());
                row.createCell(4).setCellValue(user.isAtivo() ? "Sim" : "Não");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream gerarRelatorioProdutos(List<ProdutoQuimico> produtos) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Produtos");

            String[] headers = {
                    "ID", "Nome", "CAS", "Concentração", "Densidade",
                    "Característica", "Estado Físico", "Órgãos Controladores", "Unidade"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (ProdutoQuimico p : produtos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getNome());
                row.createCell(2).setCellValue(p.getCas());
                row.createCell(3).setCellValue(p.getConcentracao());
                row.createCell(4).setCellValue(p.getDensidade());
                row.createCell(5).setCellValue(p.getCaracteristica());
                row.createCell(6).setCellValue(p.getEstadoFisico());

                String orgaos = p.getOrgaos() != null
                        ? String.join(", ", p.getOrgaos().stream().map(Enum::name).toList())
                        : "";
                row.createCell(7).setCellValue(orgaos);

                row.createCell(8).setCellValue(p.getUnidadeMedida() != null ? p.getUnidadeMedida().getSigla() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public ByteArrayInputStream gerarRelatorioEstoque(List<Estoque> estoques) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Estoque");

            String[] headers = {
                    "Produto ID", "Produto Nome", "CAS", "Concentração", "Densidade", "Estado Físico", "Característica",
                    "Quantidade", "Lote", "Validade", "Fabricação", "Laboratório",
                    "Nota Fiscal Nº", "Data de Recebimento", "Fornecedor"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Estoque e : estoques) {
                Row row = sheet.createRow(rowNum++);

                ProdutoQuimico p = e.getProduto();
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getNome());
                row.createCell(2).setCellValue(p.getCas());
                row.createCell(3).setCellValue(p.getConcentracao());
                row.createCell(4).setCellValue(p.getDensidade());
                row.createCell(5).setCellValue(p.getEstadoFisico());
                row.createCell(6).setCellValue(p.getCaracteristica());

                row.createCell(7).setCellValue(e.getQuantidade());
                row.createCell(8).setCellValue(e.getLote() != null ? e.getLote() : "");
                row.createCell(9).setCellValue(e.getDataValidade() != null ? e.getDataValidade().toString() : "");
                row.createCell(10).setCellValue(e.getDataFabricacao() != null ? e.getDataFabricacao().toString() : "");
                row.createCell(11).setCellValue(e.getLaboratorio().getNomeLaboratorio());

                if (e.getNotaFiscal() != null) {
                    row.createCell(12).setCellValue(e.getNotaFiscal().getNumeroNotaFiscal());
                    row.createCell(13).setCellValue(e.getNotaFiscal().getDataRecebimento().toString());
                    row.createCell(14).setCellValue(
                            e.getNotaFiscal().getFornecedor() != null
                                    ? e.getNotaFiscal().getFornecedor().getRazaoSocial()
                                    : ""
                    );
                }
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    public byte[] gerarRelatorioMovimentacoesPersonalizado(
            LocalDate inicio, LocalDate fim, List<String> tipos) throws IOException {

        List<Movimentacao> movimentacoes = movimentacaoRepo.findAllByDataMovimentacaoBetween(
                inicio.atStartOfDay(),
                fim.atTime(23, 59, 59)
        );

        if (!tipos.isEmpty()) {
            movimentacoes = movimentacoes.stream()
                    .filter(mov -> tipos.contains(mov.getTipoMovimentacao().name()))
                    .toList();
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Movimentações");

            String[] headers = {
                    "Data", "Tipo", "Produto ID", "Produto Nome", "CAS", "Concentração", "Densidade", "Estado Físico", "Característica",
                    "Quantidade", "Lote", "Fabricação", "Validade",
                    "Motivo Saída", "Lab Origem", "Lab Destino", "Usuário",
                    "NF Nº", "NF Data Recebimento", "Fornecedor"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Movimentacao mov : movimentacoes) {
                Row row = sheet.createRow(rowNum++);

                ProdutoQuimico p = mov.getProduto();

                row.createCell(0).setCellValue(mov.getDataMovimentacao().toString());
                row.createCell(1).setCellValue(mov.getTipoMovimentacao().name());

                row.createCell(2).setCellValue(p.getId());
                row.createCell(3).setCellValue(p.getNome());
                row.createCell(4).setCellValue(p.getCas());
                row.createCell(5).setCellValue(p.getConcentracao());
                row.createCell(6).setCellValue(p.getDensidade());
                row.createCell(7).setCellValue(p.getEstadoFisico());
                row.createCell(8).setCellValue(p.getCaracteristica());

                row.createCell(9).setCellValue(mov.getQuantidade());
                row.createCell(10).setCellValue(mov.getLote());
                row.createCell(11).setCellValue(mov.getFabricacao() != null ? mov.getFabricacao().toString() : "");
                row.createCell(12).setCellValue(mov.getValidade() != null ? mov.getValidade().toString() : "");
                row.createCell(13).setCellValue(mov.getMotivoSaida() != null ? mov.getMotivoSaida().name() : "");
                row.createCell(14).setCellValue(mov.getLaboratorioOrigem() != null ? mov.getLaboratorioOrigem().getNomeLaboratorio() : "");
                row.createCell(15).setCellValue(mov.getLaboratorioDestino() != null ? mov.getLaboratorioDestino().getNomeLaboratorio() : "");
                row.createCell(16).setCellValue(mov.getUsuario() != null ? mov.getUsuario().getName() : "");
                row.createCell(17).setCellValue(mov.getNotaFiscal() != null ? String.valueOf(mov.getNotaFiscal().getNumeroNotaFiscal()) : "");
                row.createCell(18).setCellValue(
                        mov.getNotaFiscal() != null && mov.getNotaFiscal().getDataRecebimento() != null
                                ? mov.getNotaFiscal().getDataRecebimento().toString() : ""
                );
                row.createCell(19).setCellValue(
                        mov.getNotaFiscal() != null && mov.getNotaFiscal().getFornecedor() != null
                                ? mov.getNotaFiscal().getFornecedor().getRazaoSocial() : ""
                );
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }







}


