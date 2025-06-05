package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaboratorioRepository extends JpaRepository<Laboratorio, Long> {

    List<Laboratorio> findAllByResponsavelId(Long userId);


}
