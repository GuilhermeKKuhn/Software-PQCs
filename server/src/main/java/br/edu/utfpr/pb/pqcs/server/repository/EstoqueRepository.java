package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO;
import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    List<Estoque> findByProdutoAndLaboratorioOrderByValidadeAsc(
            ProdutoQuimico produto, Laboratorio laboratorio
    );

    Optional<Estoque> findByProdutoAndLaboratorioAndLote(
            ProdutoQuimico produto, Laboratorio laboratorio, String lote
    );

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote, SUM(e.quantidade), MAX(e.validade), e.laboratorio.id
    )
    FROM Estoque e
    WHERE e.produto.id = :produtoId
    GROUP BY e.lote, e.laboratorio.id
    HAVING SUM(e.quantidade) > 0""")
    List<LoteDisponivelDTO> buscarLotesDisponiveisPorProduto(@Param("produtoId") Long produtoId);

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.LoteDisponivelDTO(
        e.lote,
        CAST(e.quantidade AS double),
        e.validade,
        e.laboratorio.id
    )
    FROM Estoque e
    WHERE e.produto.id = :produtoId
      AND e.laboratorio.id = :laboratorioId
      AND e.quantidade > 0""")
    List<LoteDisponivelDTO> findLotesDisponiveisPorProdutoELaboratorio(
            @Param("produtoId") Long produtoId,
            @Param("laboratorioId") Long laboratorioId
    );



}
