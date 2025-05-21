package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Estoque;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
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
}
