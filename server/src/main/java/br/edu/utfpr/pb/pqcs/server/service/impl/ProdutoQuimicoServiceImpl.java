package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.repository.ProdutoQuimicoRepository;
import br.edu.utfpr.pb.pqcs.server.service.IProdutoQuimicoService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ProdutoQuimicoServiceImpl extends CrudServiceImpl<ProdutoQuimico, Long>
        implements IProdutoQuimicoService {

    private final ProdutoQuimicoRepository produtoQuimicoRepository;

    public ProdutoQuimicoServiceImpl(ProdutoQuimicoRepository produtoQuimicoRepository ) {
        this.produtoQuimicoRepository = produtoQuimicoRepository;
    }

    @Override
    protected JpaRepository<ProdutoQuimico, Long> getRepository() {
        return produtoQuimicoRepository;
    }

   
}
