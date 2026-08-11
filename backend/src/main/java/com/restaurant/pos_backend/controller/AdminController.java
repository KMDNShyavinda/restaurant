package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.RegisterRequest;
import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getPendingUsers() {
        List<User> pendingUsers = authService.getPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody RegisterRequest request) {
        User created = authService.createUserByAdmin(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        User updatedUser = authService.updateUserStatus(id, status);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        User updatedUser = authService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
