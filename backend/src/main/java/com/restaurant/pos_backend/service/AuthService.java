package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.AuthResponse;
import com.restaurant.pos_backend.dto.LoginRequest;
import com.restaurant.pos_backend.dto.RegisterRequest;
import com.restaurant.pos_backend.entity.Branch;
import com.restaurant.pos_backend.entity.Role;
import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.repository.BranchRepository;
import com.restaurant.pos_backend.repository.RoleRepository;
import com.restaurant.pos_backend.repository.UserRepository;
import com.restaurant.pos_backend.security.CustomUserDetails;
import com.restaurant.pos_backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                .status(userDetails.getStatus())
                .branchId(userDetails.getBranchId())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address is already in use.");
        }

        String targetRoleName = request.getRoleName() != null ? request.getRoleName().toUpperCase() : "CASHIER";
        Role role = roleRepository.findByName(targetRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).description(targetRoleName + " role").build()));

        Long branchId = request.getBranchId() != null ? request.getBranchId() : 1L;
        Branch branch = branchRepository.findById(branchId).orElse(null);

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .branch(branch)
                .status("PENDING")
                .build();

        userRepository.save(newUser);

        // Auto-login registered user and generate JWT
        return login(new LoginRequest(request.getEmail(), request.getPassword()));
    }
}
