package es.huertosbellavista.backend.core.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import net.miarma.backlib.dto.*;
import net.miarma.backlib.exception.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.huertosbellavista.backend.core.mapper.CredentialMapper;
import es.huertosbellavista.backend.core.mapper.UserMapper;
import es.huertosbellavista.backend.core.model.Credential;
import es.huertosbellavista.backend.core.model.User;

@Service
public class AuthService {

    private final CredentialService credentialService;
    private final UserService userService;
    private final net.miarma.backlib.security.JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(CredentialService credentialService, UserService userService,
                       net.miarma.backlib.security.JwtService jwtService, PasswordEncoder passwordEncoder) {
	this.credentialService = credentialService;
	this.userService = userService;
	this.jwtService = jwtService;
	this.passwordEncoder = passwordEncoder;
	}

    public LoginResponse login(LoginRequest request) {
        Credential cred = credentialService.getForLogin(request.serviceId(), request.username());

        if (!passwordEncoder.matches(request.password(), cred.getPassword())) {
            throw new UnauthorizedException("Credenciales no válidas");
        }

        if (cred.getStatus() == 0) {
            throw new ForbiddenException("Esa cuenta está desactivada");
        }

        String token = jwtService.generateToken(cred.getUserId(), request.serviceId());
        UserDto userDto = UserMapper.toDto(cred.getUser());
        CredentialDto credentialDto = CredentialMapper.toDto(cred);

        return new LoginResponse(token, userDto, credentialDto);
    }

    public LoginResponse register(RegisterRequest request) {
        UUID userIdByUsername = null;
        UUID userIdByEmail = null;

        Optional<Credential> credByUsername = credentialService.getByUsername(request.username()).stream().findFirst();
        if(credByUsername.isPresent()) {
            userIdByUsername = credByUsername.get().getUserId();
        }

        List<Credential> accountsByEmail = credentialService.getByEmail(request.email());
        if (!accountsByEmail.isEmpty()) {
            userIdByEmail =  accountsByEmail.getFirst().getUserId();
        }

        User user;
        if (userIdByUsername != null && userIdByEmail != null) {
            if (!userIdByUsername.equals(userIdByEmail)) {
                throw new ConflictException("Username y email ya existen pero pertenecen a usuarios distintos");
            }
            user = userService.getById(userIdByUsername);
        } else if (userIdByUsername != null) {
            user = userService.getById(userIdByUsername);
        } else if (userIdByEmail != null) {
            user = userService.getById(userIdByEmail);
        } else {
            CreateUserDto dto = new CreateUserDto(request.displayName(), null);
            user = userService.create(UserMapper.fromCreateDto(dto));
        }

        Credential cred = new Credential();
        cred.setCredentialId(UUID.randomUUID());
        cred.setUserId(user.getUserId());
        cred.setUser(user);
        cred.setServiceId(request.serviceId());
        cred.setUsername(request.username());
        cred.setEmail(request.email());
        cred.setPassword(request.password());
        cred.setStatus((byte)1);
        credentialService.create(cred);

        String token = jwtService.generateToken(user.getUserId(), request.serviceId());

        return new LoginResponse(token, UserMapper.toDto(user), CredentialMapper.toDto(cred));
    }

    public void changePassword(UUID userId, ChangePasswordRequest request) {
        Credential cred = credentialService.getByUserId(userId)
                .stream()
                .filter(c -> c.getServiceId().equals(request.serviceId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cuenta no encontrada"));

        if (!passwordEncoder.matches(request.oldPassword(), cred.getPassword())) {
            throw new ValidationException("oldPassword", "La contraseña actual es incorrecta");
        }

        if (request.newPassword().length() < 8) {
            throw new ValidationException("newPassword", "La nueva contraseña debe tener al menos 8 caracteres");
        }

        credentialService.updatePassword(cred.getCredentialId(), request);
    }
}
