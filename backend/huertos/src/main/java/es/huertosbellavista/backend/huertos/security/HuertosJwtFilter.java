package es.huertosbellavista.backend.huertos.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import es.huertosbellavista.backend.huertos.model.UserMetadata;
import es.huertosbellavista.backend.huertos.service.UserMetadataService;
import net.miarma.backlib.security.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class HuertosJwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserMetadataService metadataService;

    public HuertosJwtFilter(JwtService jwtService, UserMetadataService metadataService) {
        this.jwtService = jwtService;
        this.metadataService = metadataService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtService.validateToken(token)) {
                UUID userId = jwtService.getUserId(token);
                Byte serviceId = jwtService.getServiceId(token);

                UserMetadata metadata = metadataService.getById(userId);

                if (metadata != null) {
                    var principal = new HuertosPrincipal(
                        userId,
                        metadata.getRole(),
                        metadata.getType(),
                        serviceId
                    );

                    var auth = new UsernamePasswordAuthenticationToken(
                        principal, null, principal.getAuthorities()
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
