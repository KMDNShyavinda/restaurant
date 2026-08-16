package com.restaurant.pos_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, ClientRequestInfo> requestCounts = new ConcurrentHashMap<>();

    private static final int AUTH_LIMIT_PER_MINUTE = 10;
    private static final int GENERAL_LIMIT_PER_MINUTE = 120;
    private static final long ONE_MINUTE_MS = 60000L;

    private static class ClientRequestInfo {
        long startTime = System.currentTimeMillis();
        int count = 0;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        String requestUri = request.getRequestURI();
        long now = System.currentTimeMillis();

        boolean isAuthEndpoint = requestUri.startsWith("/api/auth/login") || requestUri.startsWith("/api/auth/register");
        int limit = isAuthEndpoint ? AUTH_LIMIT_PER_MINUTE : GENERAL_LIMIT_PER_MINUTE;

        ClientRequestInfo info = requestCounts.compute(clientIp + ":" + (isAuthEndpoint ? "AUTH" : "GEN"), (key, existing) -> {
            if (existing == null || (now - existing.startTime) > ONE_MINUTE_MS) {
                ClientRequestInfo newInfo = new ClientRequestInfo();
                newInfo.startTime = now;
                newInfo.count = 1;
                return newInfo;
            } else {
                existing.count++;
                return existing;
            }
        });

        if (info.count > limit) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Please wait a minute before trying again.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
