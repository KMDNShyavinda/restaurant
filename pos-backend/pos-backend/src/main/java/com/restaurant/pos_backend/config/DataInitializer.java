package com.restaurant.pos_backend.config;

import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByEmail("admin@pos.com").ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode("password123"));
            userRepository.save(user);
            System.out.println(">>> Default admin password initialized successfully with valid BCrypt hash!");
        });
    }
}
