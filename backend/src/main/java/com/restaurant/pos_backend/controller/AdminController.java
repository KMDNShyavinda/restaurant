package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.service.AuthService;
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

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getPendingUsers() {
        List<User> pendingUsers = authService.getPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        User updatedUser = authService.updateUserStatus(id, status);
        return ResponseEntity.ok(updatedUser);
    }
}
