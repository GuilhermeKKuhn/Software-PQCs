package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.UserDTO;
import br.edu.utfpr.pb.pqcs.server.model.User;
import br.edu.utfpr.pb.pqcs.server.service.UserService;
import br.edu.utfpr.pb.pqcs.server.shared.GenericResponse;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(UserService userService,
                          ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/createUser")
    public GenericResponse createUser(@Valid @RequestBody UserDTO user) {
        User userEntity = modelMapper.map(user, User.class);
        userService.save(userEntity);

        GenericResponse genericResponse = new GenericResponse();
        genericResponse.setMessage("User saved.");
        return genericResponse;
    }

}
