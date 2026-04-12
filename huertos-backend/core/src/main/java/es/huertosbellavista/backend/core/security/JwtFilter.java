package es.huertosbellavista.backend.core.security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import es.huertosbellavista.backend.core.model.User;
import net.miarma.backlib.security.JwtService;
import es.huertosbellavista.backend.core.service.UserService;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
    private final UserService userService;
    private final long refreshThreshold = 300_000;

    public JwtFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtService.validateToken(token)) {
                    UUID userId = jwtService.getUserId(token);
                    Byte serviceId = jwtService.getServiceId(token);

                    User user = userService.getById(userId);
                    CorePrincipal principal = new CorePrincipal(userId, user.getGlobalRole());
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    long timeLeft = jwtService.getExpiration(token).getTime() - System.currentTimeMillis();
                    if (timeLeft < refreshThreshold) {
                        String newToken = jwtService.generateToken(userId, serviceId);
                        response.setHeader("X-Refresh-Token", newToken);
                    }
                }
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}