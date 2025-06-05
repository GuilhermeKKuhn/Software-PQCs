package br.edu.utfpr.pb.pqcs.server.service;

import br.edu.utfpr.pb.pqcs.server.dto.UserDTO;
import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.User;
import br.edu.utfpr.pb.pqcs.server.repository.DepartamentoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LaboratorioRepository laboratorioRepository;
    private final DepartamentoRepository departamentoRepository;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder, LaboratorioRepository laboratorioRepository, DepartamentoRepository departamentoRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.laboratorioRepository = laboratorioRepository;
        this.departamentoRepository = departamentoRepository;
    }

    public UserDTO getUserDTO(User user) {
        UserDTO dto = new UserDTO(user);

        // Departamentos
        List<Departamento> departamentos = departamentoRepository.findAllByResponsavelId(user.getId());
        dto.setDepartamentosId(
                departamentos.stream().map(Departamento::getId).toList()
        );
        dto.setNomesDepartamentos(
                departamentos.stream().map(Departamento::getNomeDepartamento).toList()
        );

        // Laboratórios
        List<Laboratorio> laboratorios = laboratorioRepository.findAllByResponsavelId(user.getId());
        dto.setLaboratoriosId(
                laboratorios.stream().map(Laboratorio::getId).toList()
        );
        dto.setNomesLaboratorios(
                laboratorios.stream().map(Laboratorio::getNomeLaboratorio).toList()
        );

        return dto;
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

        if (updatedUserData.getUsername() != null && !updatedUserData.getUsername().isBlank()) {
            existingUser.setUsername(updatedUserData.getUsername());
        }

        if (updatedUserData.getName() != null && !updatedUserData.getName().isBlank()) {
            existingUser.setName(updatedUserData.getName());
        }

        if (updatedUserData.getPassword() != null && !updatedUserData.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUserData.getPassword()));
        }

        if (updatedUserData.getEmail() != null && !updatedUserData.getEmail().isBlank()) {
            existingUser.setEmail(updatedUserData.getEmail());
        }

        if (updatedUserData.getTipoPerfil() != null) {
            existingUser.setTipoPerfil(updatedUserData.getTipoPerfil());
        }

        if (updatedUserData.getSiape() != null && !updatedUserData.getSiape().isBlank()) {
            existingUser.setSiape(updatedUserData.getSiape());
        }

        existingUser.setAtivo(updatedUserData.isAtivo());

        return userRepository.save(existingUser);
    }






}
