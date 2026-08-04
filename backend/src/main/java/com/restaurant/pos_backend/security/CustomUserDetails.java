package com.restaurant.pos_backend.security;

import com.restaurant.pos_backend.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String name;
    private final Long branchId;
    private final String roleName;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();
        this.name = user.getName();
        this.branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        this.roleName = user.getRole() != null ? user.getRole().getName() : "USER";

        Set<GrantedAuthority> auths = new HashSet<>();
        // Add Role authority (ROLE_ADMIN, ROLE_MANAGER, etc.)
        auths.add(new SimpleGrantedAuthority("ROLE_" + this.roleName));

        // Add Permission authorities (orders:create, reports:view, etc.)
        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            user.getRole().getPermissions().forEach(permission -> 
                auths.add(new SimpleGrantedAuthority(permission.getCode()))
            );
        }

        this.authorities = auths;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
