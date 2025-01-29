package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
