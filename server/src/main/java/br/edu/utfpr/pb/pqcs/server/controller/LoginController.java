package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.UserDTO;
import br.edu.utfpr.pb.pqcs.server.model.User;
import br.edu.utfpr.pb.pqcs.server.service.AuthService;
import br.edu.utfpr.pb.pqcs.server.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("login")
public class LoginController {

    private final AuthService authService;
    private final UserService userService;

    public LoginController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/user-info")
    public UserDTO getUserInfo(Principal principal) {
        User user = (User) authService.loadUserByUsername(principal.getName());
        return userService.getUserDTO(user);
    }
}

