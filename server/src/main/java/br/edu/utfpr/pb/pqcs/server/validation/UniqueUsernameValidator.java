package br.edu.utfpr.pb.pqcs.server.validation;

import br.edu.utfpr.pb.pqcs.server.annotation.UniqueUsername;
import br.edu.utfpr.pb.pqcs.server.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String username, ConstraintValidatorContext constraintValidatorContext) {
        if (userRepository.findUserByUsername(username) == null) {
            return true;
        }
        return false;
    }
}
