package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.dto.ItemNotaDTO;
import br.edu.utfpr.pb.pqcs.server.model.NotaFiscal;
import br.edu.utfpr.pb.pqcs.server.repository.ItensNotaFiscalRepository;
import br.edu.utfpr.pb.pqcs.server.repository.NotaFiscalRepository;
import br.edu.utfpr.pb.pqcs.server.service.INotaFiscalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaFiscalServiceImpl extends CrudServiceImpl<NotaFiscal, Long>
        implements INotaFiscalService {

    private final NotaFiscalRepository repository;
    private final ItensNotaFiscalRepository itensNotaFiscalRepository;

    public NotaFiscalServiceImpl(NotaFiscalRepository repository, ItensNotaFiscalRepository itensNotaFiscalRepository) {
        this.repository = repository;
        this.itensNotaFiscalRepository = itensNotaFiscalRepository;
    }

    public List<ItemNotaDTO> buscarItensPorNota(Long notaId) {
        return itensNotaFiscalRepository.listarItensPorNota(notaId);
    }

    @Override
    protected JpaRepository<NotaFiscal, Long> getRepository() {
        return repository;
    }
}
