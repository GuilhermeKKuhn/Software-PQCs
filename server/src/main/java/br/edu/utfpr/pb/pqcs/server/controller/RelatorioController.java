package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.model.Fornecedor;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.service.impl.EstoqueServiceImpl;
import br.edu.utfpr.pb.pqcs.server.service.impl.FornecedorServiceImpl;
import br.edu.utfpr.pb.pqcs.server.service.impl.ProdutoQuimicoServiceImpl;
import br.edu.utfpr.pb.pqcs.server.service.impl.RelatorioServiceImpl;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private RelatorioServiceImpl relatorioService;
    private FornecedorServiceImpl fornecedorService;
    private ProdutoQuimicoServiceImpl produtoQuimicoService;
    private EstoqueServiceImpl estoqueService;

    public RelatorioController(RelatorioServiceImpl relatorioService, FornecedorServiceImpl fornecedorService, ProdutoQuimicoServiceImpl produtoQuimicoService, EstoqueServiceImpl estoqueService) {
        this.relatorioService = relatorioService;
        this.fornecedorService = fornecedorService;
        this.produtoQuimicoService = produtoQuimicoService;
        this.estoqueService = estoqueService;
    }

    @GetMapping("/movimentacoes")
    public ResponseEntity<Resource> gerarRelatorioMovimentacoes(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fim") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) throws IOException {

        byte[] dadosExcel = relatorioService.gerarRelatorioMovimentacoes(inicio, fim);
        ByteArrayInputStream excelStream = new ByteArrayInputStream(dadosExcel);
        InputStreamResource file = new InputStreamResource(excelStream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-movimentacoes.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/fornecedores")
    public ResponseEntity<Resource> exportarFornecedores() {
        try {
            List<Fornecedor> fornecedores = fornecedorService.findAll();

            ByteArrayInputStream excelStream = relatorioService.gerarRelatorioFornecedores(fornecedores);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-fornecedores.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(excelStream));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<Resource> exportarUsuarios() throws IOException {
        ByteArrayInputStream stream = relatorioService.gerarRelatorioUsuarios();
        InputStreamResource file = new InputStreamResource(stream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=usuarios.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/produtos")
    public ResponseEntity<Resource> gerarRelatorioProdutos() throws IOException {
        List<ProdutoQuimico> produtos = produtoQuimicoService.findAll();
        ByteArrayInputStream stream = relatorioService.gerarRelatorioProdutos(produtos);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=produtos.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("estoque")
    public ResponseEntity<Resource> gerarRelatorioEstoque() throws IOException {
        List<Estoque> estoques = estoqueService.findAll();
        ByteArrayInputStream stream = relatorioService.gerarRelatorioEstoque(estoques);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=estoque.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/movimentacoes-personalizado")
    public ResponseEntity<byte[]> gerarRelatorioPersonalizado(
            @RequestParam String dataInicio,
            @RequestParam String dataFim,
            @RequestParam String tipos) throws IOException {

        List<String> listaTipos = List.of(tipos.split(","));

        byte[] relatorio = relatorioService.gerarRelatorioMovimentacoesPersonalizado(
                LocalDate.parse(dataInicio),
                LocalDate.parse(dataFim),
                listaTipos
        );

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=relatorio_movimentacoes.xlsx")
                .body(relatorio);
    }






}
