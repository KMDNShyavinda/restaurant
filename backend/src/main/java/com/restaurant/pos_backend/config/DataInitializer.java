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
        String[] emails = {
            "admin@pos.com",
            "manager@pos.com",
            "cashier@pos.com",
            "waiter@pos.com",
            "kitchen@pos.com"
        };
        for (String email : emails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                user.setPasswordHash(passwordEncoder.encode("password123"));
                userRepository.save(user);
            });
        }
        System.out.println(">>> Demo account passwords initialized with valid BCrypt hashes for: admin, manager, cashier, waiter, kitchen");
    }
}
