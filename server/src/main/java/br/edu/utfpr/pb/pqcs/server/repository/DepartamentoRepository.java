package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

    List<Departamento> findAllByResponsavelId(Long userId);



}
