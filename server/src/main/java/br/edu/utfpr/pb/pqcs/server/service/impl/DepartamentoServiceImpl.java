package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.repository.DepartamentoRepository;
import br.edu.utfpr.pb.pqcs.server.service.IdepartamentoService;
import org.springframework.data.jpa.repository.JpaRepository;

public class DepartamentoServiceImpl extends CrudServiceImpl<Departamento, Long>
        implements IdepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoServiceImpl(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    @Override
    protected JpaRepository<Departamento, Long> getRepository() {
        return departamentoRepository;
    }
}
