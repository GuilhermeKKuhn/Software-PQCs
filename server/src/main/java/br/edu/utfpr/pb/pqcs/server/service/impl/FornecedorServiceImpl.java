package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.Fornecedor;
import br.edu.utfpr.pb.pqcs.server.repository.FornecedorRepository;
import br.edu.utfpr.pb.pqcs.server.service.IFornecedorService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class FornecedorServiceImpl extends CrudServiceImpl<Fornecedor, Long>
        implements IFornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorServiceImpl(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    @Override
    protected JpaRepository<Fornecedor, Long> getRepository() {
        return fornecedorRepository;
    }
}
