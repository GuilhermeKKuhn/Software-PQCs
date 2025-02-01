package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.repository.ProductRepository;
import br.edu.utfpr.pb.pqcs.server.service.IProductService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl extends CrudServiceImpl<ProdutoQuimico, Long>
            implements IProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    protected JpaRepository<ProdutoQuimico, Long> getRepository() {
        return productRepository;
    }
}
