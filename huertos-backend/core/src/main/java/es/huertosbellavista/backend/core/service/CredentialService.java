package es.huertosbellavista.backend.core.service;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import net.miarma.backlib.exception.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.huertosbellavista.backend.core.model.Credential;
import es.huertosbellavista.backend.core.repository.CredentialRepository;
import net.miarma.backlib.dto.ChangePasswordRequest;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public CredentialService(CredentialRepository credentialRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.credentialRepository = credentialRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public Credential getById(UUID credentialId) {
    	byte[] idBytes = UuidUtil.uuidToBin(credentialId);
    	return credentialRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Cuenta no encontrada"));
    }

    public Credential create(Credential credential) {
    	if (credential.getUsername() == null || credential.getUsername().isBlank()) {
            throw new ValidationException("userName", "El usuario no puede estar vacío");
        }
        if (credential.getEmail() == null || !credential.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new ValidationException("email", "Formato de email no válido");
        }
        if (credential.getPassword() == null || credential.getPassword().length() < 6) {
            throw new ValidationException("password", "La contraseña tiene que tener al menos 6 caracteres");
        }
        if (credential.getServiceId() == null || credential.getServiceId() < 0) {
            throw new ValidationException("serviceId", "El identificador de servicio debe ser positivo");
        }

        boolean existsUsername = credentialRepository.existsByUsernameAndServiceId(
            credential.getUsername(), credential.getServiceId());
        if (existsUsername) throw new ConflictException("El usuario ya existe para este servicio");

        boolean existsEmail = credentialRepository.existsByEmailAndServiceId(
            credential.getEmail(), credential.getServiceId());
        if (existsEmail) throw new ConflictException("El email ya existe para este servicio");

        credential.setCredentialId(UUID.randomUUID());
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        return credentialRepository.save(credential);
    }

    public List<Credential> getAll() {
    	return credentialRepository.findAll();
    }

    public List<Credential> getByServiceId(Byte serviceId) {
        return credentialRepository.findAllByServiceId(serviceId);
    }

    public List<Credential> getByServiceIdFetchUser(Byte serviceId) {
        return credentialRepository.getByServiceIdFetchUser(serviceId);
    }

    public List<Credential> getByUserId(UUID userId) {
        List<Credential> creds = credentialRepository.findByUserId(UuidUtil.uuidToBin(userId));
        if (creds.isEmpty()) {
            throw new NotFoundException("El usuario no tiene cuenta");
        }
        return creds;
    }

    public List<Credential> getByUsername(@NotBlank String username) {
        return credentialRepository.findByUsername(username);
    }
    
    public List<Credential> getByEmail(String email) {
        return credentialRepository.findByEmail(email);
    }
    
    public Credential getByUserIdAndService(UUID userId, Byte serviceId) {
    	return credentialRepository.findByUserIdAndServiceId(UuidUtil.uuidToBin(userId), serviceId)
                .orElseThrow(() -> new NotFoundException("El usuario no tiene cuenta en este sitio"));
    }

    public Credential getForLogin(Byte serviceId, String username) {
        return credentialRepository.findByServiceIdAndUsername(serviceId, username)
                .orElseThrow(() -> new BadRequestException("Credenciales no válidas"));
    }

    public boolean existsByUsernameAndService(String username, Byte serviceId) {
        return credentialRepository.findByUsernameAndServiceId(username, serviceId).isPresent();
    }
    
    public boolean isOwner(UUID credentialId, UUID userId) {
        byte[] idBytes = UuidUtil.uuidToBin(credentialId);

        return credentialRepository.findById(idBytes)
                .map(c -> c.getUserId().equals(userId))
                .orElse(false);
    }

    public Credential update(UUID credentialId, Credential changes) {
        Credential cred = getById(credentialId);

        if (changes.getUsername() != null) cred.setUsername(changes.getUsername());
        if (changes.getEmail() != null) cred.setEmail(changes.getEmail());
        if (changes.getStatus() != null) cred.setStatus(changes.getStatus());

        int updated = credentialRepository.update(
                UuidUtil.uuidToBin(cred.getCredentialId()),
                cred.getUsername(),
                cred.getEmail(),
                cred.getStatus()
        );

        if (updated == 0)
            throw new RuntimeException("No se pudo actualizar la cuenta");

        return getById(credentialId);
    }
    
    public Credential updatePassword(UUID credentialId, ChangePasswordRequest request) {
        byte[] idBytes = UuidUtil.uuidToBin(credentialId);

        Credential cred = credentialRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Cuenta no encontrada"));

        if (!passwordEncoder.matches(request.oldPassword(), cred.getPassword())) {
            throw new ValidationException("oldPassword", "La contraseña actual es incorrecta");
        }

        cred.setPassword(passwordEncoder.encode(request.newPassword()));
        return credentialRepository.save(cred);
    }

	public void delete(UUID credentialId) {
		byte[] idBytes = UuidUtil.uuidToBin(credentialId);
		if(!credentialRepository.existsById(idBytes))
			throw new NotFoundException("Cuenta no encontrada");
		credentialRepository.deleteById(idBytes);		
	}

    public Byte getStatus(UUID userId, Byte serviceId) {
        Credential credential = getByUserIdAndService(userId, serviceId);
        return credential.getStatus();
    }
}
