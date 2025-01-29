package br.edu.utfpr.pb.pqcs.server.repository;

import br.edu.utfpr.pb.pqcs.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findUserByUsername(String username);

}
