package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.NotaFiscal;
import br.edu.utfpr.pb.pqcs.server.repository.NotaFiscalRepository;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.INotaFiscalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class NotaFiscalServiceImpl extends CrudServiceImpl<NotaFiscal, Long>
        implements INotaFiscalService {

    private final NotaFiscalRepository repository;

    public NotaFiscalServiceImpl(NotaFiscalRepository repository) {
        this.repository = repository;
    }

    @Override
    protected JpaRepository<NotaFiscal, Long> getRepository() {
        return repository;
    }
}
