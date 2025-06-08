package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Solicitacao;
import br.edu.utfpr.pb.pqcs.server.model.StatusSolicitacao;
import org.hibernate.usertype.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findAllByStatus(StatusSolicitacao status);

    List<Solicitacao> findAllByLaboratorioIdInAndStatus(List<Long> labIds, StatusSolicitacao status);

    List<Solicitacao> findAllByLaboratorioIdIn(List<Long> laboratorioIds);

    List<Solicitacao> findAllBySolicitanteId(Long solicitanteId);

}
