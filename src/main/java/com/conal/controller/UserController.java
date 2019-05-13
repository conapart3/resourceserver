package com.conal.controller;

import com.conal.entity.User;
import com.conal.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController
{
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository)
    {
        this.userRepository = userRepository;
    }

    @PreAuthorize("#oauth2.hasScope('read')")
    @GetMapping("/users")
    public List<User> getUsers()
    {
        return (List<User>) userRepository.findAll();
    }

    @PreAuthorize("#oauth2.hasScope('write')")
    @PostMapping("/users")
    void addUser(@RequestBody User user)
    {
        userRepository.save(user);
    }
}
