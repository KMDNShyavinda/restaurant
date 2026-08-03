package com.restaurant.pos_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long id;
    private String name;
    private String email;
    private String role;
    private Long branchId;
}
