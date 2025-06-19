package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.dto.EstoqueLoteDTO;
import br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO;
import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    List<Estoque> findByProdutoAndLaboratorioOrderByDataValidadeAsc(
            ProdutoQuimico produto, Laboratorio laboratorio
    );

    Optional<Estoque> findByProdutoAndLaboratorioAndLote(
            ProdutoQuimico produto, Laboratorio laboratorio, String lote
    );

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote, SUM(e.quantidade), MAX(e.dataFabricacao), MAX(e.dataValidade), e.laboratorio.id, e.laboratorio.nomeLaboratorio)
    FROM Estoque e
    WHERE e.produto.id = :produtoId
    GROUP BY e.lote, e.laboratorio.id, e.laboratorio.nomeLaboratorio
    HAVING SUM(e.quantidade) > 0""")
    List<LoteDisponivelDTO> buscarLotesDisponiveisPorProduto(@Param("produtoId") Long produtoId);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote, CAST(e.quantidade AS double), e.dataFabricacao, e.dataValidade, e.laboratorio.id, e.laboratorio.nomeLaboratorio)
    FROM Estoque e
    WHERE e.produto.id = :produtoId
      AND e.laboratorio.id = :laboratorioId
      AND e.quantidade > 0""")
    List<LoteDisponivelDTO> findLotesDisponiveisPorProdutoELaboratorio(
            @Param("produtoId") Long produtoId,
            @Param("laboratorioId") Long laboratorioId
    );

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO(
        e.produto.id, e.produto.nome, SUM(e.quantidade))
    FROM Estoque e
    GROUP BY e.produto.id, e.produto.nome""")
    List<EstoqueProdutoDTO> listarResumoPorProduto();

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueLoteDTO(
        e.lote, e.dataFabricacao, e.dataValidade, CAST(e.quantidade AS double), e.laboratorio.nomeLaboratorio)
    FROM Estoque e
    WHERE e.produto.id = :produtoId AND e.quantidade > 0
    ORDER BY e.dataValidade ASC""")
    List<EstoqueLoteDTO> listarLotesPorProduto(@Param("produtoId") Long produtoId);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO(
        e.produto.id, e.produto.nome, SUM(e.quantidade))
    FROM Estoque e
    WHERE e.laboratorio.id = :laboratorioId
    GROUP BY e.produto.id, e.produto.nome""")
    List<EstoqueProdutoDTO> listarResumoPorProdutoELaboratorio(@Param("laboratorioId") Long laboratorioId);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO(
        e.produto.id, e.produto.nome, SUM(e.quantidade))
    FROM Estoque e
    WHERE e.laboratorio.departamento.id = :departamentoId
    GROUP BY e.produto.id, e.produto.nome""")
    List<EstoqueProdutoDTO> listarResumoPorProdutoEDepartamento(@Param("departamentoId") Long departamentoId);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO(
        e.produto.id, e.produto.nome, SUM(e.quantidade))
    FROM Estoque e
    WHERE e.laboratorio IN :laboratorios
    GROUP BY e.produto.id, e.produto.nome""")
    List<EstoqueProdutoDTO> listarResumoPorProdutosDosLaboratorios(@Param("laboratorios") List<Laboratorio> laboratorios);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.EstoqueProdutoDTO(
        e.produto.id, e.produto.nome, SUM(e.quantidade))
    FROM Estoque e
    WHERE e.laboratorio.departamento IN :departamentos
    GROUP BY e.produto.id, e.produto.nome""")
    List<EstoqueProdutoDTO> listarResumoPorProdutosDosDepartamentos(@Param("departamentos") List<Departamento> departamentos);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote, CAST(e.quantidade AS double), e.dataFabricacao, e.dataValidade, e.laboratorio.id, e.laboratorio.nomeLaboratorio)
    FROM Estoque e
    WHERE e.produto.id = :produtoId
      AND e.laboratorio.id IN :laboratoriosIds
      AND e.quantidade > 0""")
    List<LoteDisponivelDTO> findLotesDisponiveisPorProdutoELaboratorios(
            @Param("produtoId") Long produtoId,
            @Param("laboratoriosIds") List<Long> laboratoriosIds
    );

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote, CAST(e.quantidade AS double), e.dataFabricacao, e.dataValidade, e.laboratorio.id, e.laboratorio.nomeLaboratorio)
    FROM Estoque e
    WHERE e.produto.id = :produtoId
      AND e.laboratorio.departamento.id IN :departamentosIds
      AND e.quantidade > 0""")
    List<LoteDisponivelDTO> findLotesPorProdutoEDepartamentos(
            @Param("produtoId") Long produtoId,
            @Param("departamentosIds") List<Long> departamentosIds
    );
}
