package com.restaurant.pos_backend.config;

import com.restaurant.pos_backend.entity.Branch;
import com.restaurant.pos_backend.entity.Role;
import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String encodedPassword = passwordEncoder.encode("password123");

        // Guarantee all demo accounts exist with valid BCrypt hash
        createOrUpdateUser("admin@pos.com", "System Owner", 1L, encodedPassword);
        createOrUpdateUser("manager@pos.com", "Sarah Manager", 2L, encodedPassword);
        createOrUpdateUser("cashier@pos.com", "Chris Cashier", 3L, encodedPassword);
        createOrUpdateUser("waiter@pos.com", "Will Waiter", 4L, encodedPassword);
        createOrUpdateUser("kitchen@pos.com", "Kevin Kitchen", 5L, encodedPassword);

        System.out.println(">>> Demo account passwords initialized successfully with valid BCrypt hashes for: admin, manager, cashier, waiter, kitchen (password: password123)");
    }

    private void createOrUpdateUser(String email, String defaultName, Long roleId, String encodedPassword) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(defaultName);
            newUser.setStatus("ACTIVE");
            return newUser;
        });

        user.setPasswordHash(encodedPassword);

        if (user.getRole() == null && roleId != null) {
            Role role = entityManager.find(Role.class, roleId);
            if (role != null) {
                user.setRole(role);
            }
        }
        if (user.getBranch() == null) {
            Branch branch = entityManager.find(Branch.class, 1L);
            if (branch != null) {
                user.setBranch(branch);
            }
        }

        userRepository.save(user);
    }
}
