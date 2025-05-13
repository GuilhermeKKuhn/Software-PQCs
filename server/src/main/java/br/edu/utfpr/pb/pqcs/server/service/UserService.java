package br.edu.utfpr.pb.pqcs.server.service;

import br.edu.utfpr.pb.pqcs.server.model.User;
import br.edu.utfpr.pb.pqcs.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save(User user) {
        user.setPassword( passwordEncoder.encode(user.getPassword()) );
        return this.userRepository.save(user);
    }

    public User findByUsername(String username) {
        User user = userRepository.findUserByUsername(username);
        if ( user == null ){
            throw new UsernameNotFoundException("usuario não encontrado" + username);
        }
        return user;
    }


    public User findByEmail(String email) {
        User user = userRepository.findUserByEmail(email);
        if ( user == null ){
            throw new RuntimeException("email não encontreado" + email);
        }
        return user;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
    }


    public List<User> findAll() {
        List<User> users = userRepository.findAll();
        return users;
    }

    public User deleteById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        userRepository.delete(user);
        return user;
    }

    public User updateUser(Long id, User updatedUserData) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
        if (updatedUserData.getUsername() != null) {
            existingUser.setUsername(updatedUserData.getUsername());
        }
        if (updatedUserData.getPassword() != null) {
            existingUser.setPassword(updatedUserData.getPassword());
        }
        if (updatedUserData.getEmail() != null) {
            existingUser.setEmail(updatedUserData.getEmail());
        }
        existingUser.setAtivo(updatedUserData.isAtivo());
        if (updatedUserData.getTipoPerfil() != null) {
            existingUser.setTipoPerfil(updatedUserData.getTipoPerfil());
        }
        if (updatedUserData.getSiape() != null) {
            existingUser.setSiape(updatedUserData.getSiape());
        }
        return userRepository.save(existingUser);
    }




}
