package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.UnidadeMedida;
import br.edu.utfpr.pb.pqcs.server.repository.UnidadeMedidaRepository;
import br.edu.utfpr.pb.pqcs.server.service.IUnidadeMedidaService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class UnidadeMedidaServiceImpl extends CrudServiceImpl<UnidadeMedida, Long>
        implements IUnidadeMedidaService {

    private final UnidadeMedidaRepository unidadeMedidaRepository;

    public UnidadeMedidaServiceImpl(UnidadeMedidaRepository repository) {
        this.unidadeMedidaRepository = repository;
    }

    @Override
    protected JpaRepository<UnidadeMedida, Long> getRepository() {
        return unidadeMedidaRepository;
    }
}
