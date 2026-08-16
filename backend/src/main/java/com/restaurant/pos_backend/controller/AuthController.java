package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.AuthResponse;
import com.restaurant.pos_backend.dto.LoginRequest;
import com.restaurant.pos_backend.dto.RegisterRequest;
import com.restaurant.pos_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    private void attachJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("pos_jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true when running under HTTPS in production
        cookie.setPath("/");
        cookie.setMaxAge(86400); // 24 hours
        response.addCookie(cookie);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse httpResponse) {
        AuthResponse response = authService.login(request);
        attachJwtCookie(httpResponse, response.getToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse httpResponse) {
        AuthResponse response = authService.register(request);
        attachJwtCookie(httpResponse, response.getToken());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("pos_jwt_token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}
