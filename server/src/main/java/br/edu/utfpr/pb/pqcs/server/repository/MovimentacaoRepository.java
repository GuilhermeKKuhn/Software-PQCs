package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    List<Movimentacao> findAllByDataMovimentacaoBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("""
    SELECT m FROM Movimentacao m
    WHERE (m.laboratorioOrigem.id IN :labs OR m.laboratorioDestino.id IN :labs)
    """)
    List<Movimentacao> findAllByLaboratorios(@Param("labs") List<Long> labs);

    List<Movimentacao> findAllByLaboratorioOrigem_IdInOrLaboratorioDestino_IdIn(
            List<Long> laboratorioOrigemIds,
            List<Long> laboratorioDestinoIds
    );
}