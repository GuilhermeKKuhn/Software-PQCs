package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.dto.ItemNotaDTO;
import br.edu.utfpr.pb.pqcs.server.model.ItensNotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItensNotaFiscalRepository extends JpaRepository<ItensNotaFiscal, Long> {

    @Query("""
    SELECT new br.edu.utfpr.pb.pqcs.server.dto.ItemNotaDTO(
        p.nome, i.lote, CAST(i.quantidade AS double))
    FROM ItensNotaFiscal i
    JOIN i.produtoQuimico p
    WHERE i.notaFiscal.id = :notaId""")
    List<ItemNotaDTO> listarItensPorNota(@Param("notaId") Long notaId);


}
