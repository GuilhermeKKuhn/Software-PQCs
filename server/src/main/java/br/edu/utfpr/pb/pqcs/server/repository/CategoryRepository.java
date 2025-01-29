package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByNameContaining(String name);

}
