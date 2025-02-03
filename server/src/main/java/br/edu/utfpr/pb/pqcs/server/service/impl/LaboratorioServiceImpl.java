package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.service.IlaboratorioService;
import org.springframework.data.jpa.repository.JpaRepository;

public class LaboratorioServiceImpl extends CrudServiceImpl<Laboratorio, Long>
        implements IlaboratorioService {

    private final LaboratorioRepository laboratorioRepository;

    public LaboratorioServiceImpl(LaboratorioRepository laboratorioRepository) {
        this.laboratorioRepository = laboratorioRepository;
    }

    @Override
    protected JpaRepository<Laboratorio, Long> getRepository() {
        return laboratorioRepository;
    }
}
