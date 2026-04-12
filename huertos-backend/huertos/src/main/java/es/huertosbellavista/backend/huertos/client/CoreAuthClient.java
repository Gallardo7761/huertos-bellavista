package es.huertosbellavista.backend.huertos.client;

import net.miarma.backlib.dto.ApiErrorDto;
import net.miarma.backlib.dto.LoginRequest;
import net.miarma.backlib.dto.LoginResponse;
import net.miarma.backlib.exception.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Component
public class CoreAuthClient {

    private final RestTemplate restTemplate;
    private final String coreUrl;

    public CoreAuthClient(
            @Qualifier("authRestTemplate") RestTemplate restTemplate,
            @Value("${core.url}") String coreUrl
    ) {
        this.restTemplate = restTemplate;
        this.coreUrl = coreUrl;
    }


    public LoginResponse login(LoginRequest req) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> requestEntity = new HttpEntity<>(req, headers);

        ResponseEntity<LoginResponse> response = restTemplate.exchange(
                coreUrl + "/auth/login",
                HttpMethod.POST,
                requestEntity,
                LoginResponse.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            handleError(response);
        }

        return response.getBody();
    }

    private void handleError(ResponseEntity<?> response) {
        HttpStatusCode statusCode = response.getStatusCode();

        if (statusCode.equals(HttpStatus.UNAUTHORIZED)) {
            throw new UnauthorizedException("Credenciales no válidas");
        } else if (statusCode.equals(HttpStatus.FORBIDDEN)) {
            throw new ForbiddenException("Esa cuenta está desactivada");
        } else if (statusCode.equals(HttpStatus.NOT_FOUND)) {
            throw new NotFoundException("No encontrado");
        } else if (statusCode.equals(HttpStatus.BAD_REQUEST)) {
            throw new BadRequestException("Datos de solicitud faltantes");
        } else if (statusCode.equals(HttpStatus.CONFLICT)) {
            throw new ConflictException("Ya existe");
        } else if (statusCode.equals(HttpStatus.UNPROCESSABLE_CONTENT)) {
            throw new ValidationException("general", "Los datos no tienen formato válido");
        } else {
            if (statusCode.is4xxClientError()) {
                throw new BadRequestException(response.getBody().toString());
            } else {
                throw new RuntimeException("Error desconocido");
            }
        }
    }
}
