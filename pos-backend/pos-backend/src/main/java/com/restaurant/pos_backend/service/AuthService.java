package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.AuthResponse;
import com.restaurant.pos_backend.dto.LoginRequest;
import com.restaurant.pos_backend.security.CustomUserDetails;
import com.restaurant.pos_backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getUsername())
                .role(userDetails.getRoleName())
                .branchId(userDetails.getBranchId())
                .build();
    }
}
