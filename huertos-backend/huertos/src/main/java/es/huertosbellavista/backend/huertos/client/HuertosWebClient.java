package es.huertosbellavista.backend.huertos.client;

import es.huertosbellavista.backend.huertos.dto.RegistrationResultDto;
import es.huertosbellavista.backend.huertos.dto.RequestMetadataDto;
import es.huertosbellavista.backend.huertos.util.UsernameGenerator;
import net.miarma.backlib.dto.*;
import net.miarma.backlib.exception.*;
import net.miarma.backlib.security.PasswordGenerator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class HuertosWebClient {

    private final RestTemplate restTemplate;
    private final String coreUrl;
    private final ObjectMapper objectMapper;

    public HuertosWebClient(@Qualifier("secureRestTemplate") RestTemplate restTemplate,
                            @Value("${core.url}") String coreUrl,
                            ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.coreUrl = coreUrl;
        this.objectMapper = objectMapper;
    }

    public UserWithCredentialDto getUserWithCredential(UUID userId, Byte serviceId) {
        ResponseEntity<UserWithCredentialDto> response = restTemplate.exchange(
            coreUrl + "/users/{user_id}/service/{service_id}",
            HttpMethod.GET,
            null,
            UserWithCredentialDto.class,
            userId, serviceId
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            handleError(response);
        }

        return response.getBody();
    }

    public List<UserWithCredentialDto> getAllUsersWithCredentials(Byte serviceId) {
        ResponseEntity<UserWithCredentialDto[]> response = restTemplate.exchange(
                coreUrl + "/users/service/{service_id}",
                HttpMethod.GET,
                null,
                UserWithCredentialDto[].class,
                serviceId
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            handleError(response);
        }

        UserWithCredentialDto[] arr = response.getBody();
        return arr == null ? List.of() : Arrays.asList(arr);
    }

    public RegistrationResultDto createUser(RequestMetadataDto metadataDto) {
        CreateUserDto userDto = new CreateUserDto(metadataDto.displayName(), null);
        HttpEntity<CreateUserDto> userRequestEntity = new HttpEntity<>(userDto);

        ResponseEntity<UserDto> userResponse = restTemplate.exchange(
                coreUrl + "/users",
                HttpMethod.POST,
                userRequestEntity,
                UserDto.class
        );

        if (!userResponse.getStatusCode().is2xxSuccessful()) {
            handleError(userResponse);
        }

        UserDto createdUser = userResponse.getBody();
        if (createdUser == null) {
            throw new RuntimeException("No se pudo crear al usuario");
        }

        String rawPassword = PasswordGenerator.generate(8);

        CreateCredentialDto credDto = new CreateCredentialDto(
                createdUser.getUserId(),
                (byte) 1,
                UsernameGenerator.generate(metadataDto.displayName(), metadataDto.memberNumber()),
                metadataDto.email(),
                rawPassword,
                (byte) 1
        );

        HttpEntity<CreateCredentialDto> credRequestEntity = new HttpEntity<>(credDto);

        ResponseEntity<CredentialDto> credResponse = restTemplate.exchange(
                coreUrl + "/credentials",
                HttpMethod.POST,
                credRequestEntity,
                CredentialDto.class
        );

        if (!credResponse.getStatusCode().is2xxSuccessful()) {
            handleError(credResponse);
        }

        CredentialDto createdCred = credResponse.getBody();
        if (createdCred == null) {
            throw new RuntimeException("No se pudo crear la cuenta del usuario");
        }

        return new RegistrationResultDto(
            new UserWithCredentialDto(createdUser, createdCred),
            rawPassword
        );
    }

    public void updateUser(UUID userId, UserWithCredentialDto dto) {
        HttpEntity<UserDto> userRequestEntity = new HttpEntity<>(dto.user());
        ResponseEntity<Void> userResponse = restTemplate.exchange(
                coreUrl + "/users/{user_id}",
                HttpMethod.PUT,
                userRequestEntity,
                Void.class,
                userId
        );

        if (!userResponse.getStatusCode().is2xxSuccessful()) {
            handleError(userResponse);
        }

        HttpEntity<CredentialDto> credRequestEntity = new HttpEntity<>(dto.account());
        ResponseEntity<Void> credResponse = restTemplate.exchange(
                coreUrl + "/credentials/{credential_id}/full",
                HttpMethod.PUT,
                credRequestEntity,
                Void.class,
                dto.account().getCredentialId()
        );

        if (!credResponse.getStatusCode().is2xxSuccessful()) {
            handleError(credResponse);
        }
    }

    public void deleteUser(UUID userId) {
        ResponseEntity<Void> response = restTemplate.exchange(
                coreUrl + "/users/{user_id}",
                HttpMethod.DELETE,
                null,
                Void.class,
                userId
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            if (response.getStatusCode() != HttpStatus.NOT_FOUND) {
                handleError(response);
            }
        }
    }

    public Byte getCredentialStatus(UUID userId, Byte serviceId) {
        ResponseEntity<Byte> response = restTemplate.exchange(
                coreUrl + "/credentials/{service_id}/{user_id}/status",
                HttpMethod.GET,
                null,
                Byte.class,
                serviceId, userId
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            handleError(response);
        }

        return response.getBody();
    }

    public void updateCredentialStatus(UUID userId, Byte serviceId, Byte newStatus) {
        ChangeStatusRequest req = new ChangeStatusRequest(newStatus);
        HttpEntity<ChangeStatusRequest> requestEntity = new HttpEntity<>(req);

        ResponseEntity<Void> response = restTemplate.exchange(
                coreUrl + "/credentials/{service_id}/{user_id}/status",
                HttpMethod.PUT,
                requestEntity,
                Void.class,
                serviceId, userId
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            handleError(response);
        }
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
