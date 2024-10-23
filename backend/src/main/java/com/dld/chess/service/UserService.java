package com.dld.chess.service;

import com.dld.chess.dto.UserDTO;
import com.dld.chess.entity.Role;
import com.dld.chess.entity.User;
import com.dld.chess.repository.RoleRepository;
import com.dld.chess.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Arrays;
import java.util.HashSet;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void saveUser(UserDTO userDTO) throws SQLIntegrityConstraintViolationException{
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());

        Role userRole = roleRepository.findByName("ROLE_USER");
        user.setRoles(new HashSet<>(Arrays.asList(userRole)));

        userRepository.save(user);
    }


    public void updateUserPoints(String username, int points){
        User user = userRepository.findByUsername(username);
        user.setPoints(user.getPoints() + (points));
        userRepository.save(user);
    }

}
