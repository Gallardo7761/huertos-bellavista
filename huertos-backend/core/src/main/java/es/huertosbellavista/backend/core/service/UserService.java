package es.huertosbellavista.backend.core.service;

import java.util.List;
import java.util.UUID;

import es.huertosbellavista.backend.core.mapper.UserMapper;
import net.miarma.backlib.dto.ChangeAvatarRequest;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.exception.ValidationException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.core.model.User;
import es.huertosbellavista.backend.core.repository.UserRepository;
import net.miarma.backlib.dto.UserDto;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class UserService {
	private final UserRepository userRepository;
	
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	public List<User> getAll() {
		return userRepository.findAll();
	}
	
	public User getById(UUID userId) {
		byte[] idBytes = UuidUtil.uuidToBin(userId);
		return userRepository.findById(idBytes)
          .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
	}

    public User create(User user) {
        if(user.getDisplayName() == null || user.getDisplayName().isBlank()) {
            throw new ValidationException("displayName", "El nombre a mostrar es necesario");
        }
        return userRepository.save(user);
    }

    public User update(UUID userId, User changes) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if (changes.getDisplayName() != null) {
            String dn = changes.getDisplayName().trim();
            if (dn.isEmpty()) throw new ValidationException("displayName", "No puede estar vacío");
            if (dn.length() > 50) throw new ValidationException("displayName", "Máx 50 caracteres");
            user.setDisplayName(dn);
        }

        if (changes.getAvatar() != null)
            user.setAvatar(changes.getAvatar());

        if (changes.getGlobalRole() != null)
            user.setGlobalRole(changes.getGlobalRole());

        if (changes.getGlobalStatus() != null)
            user.setGlobalStatus(changes.getGlobalStatus());

        return userRepository.save(user);
    }

    public void delete(UUID userId) {
		byte[] idBytes = UuidUtil.uuidToBin(userId);
		if(!userRepository.existsById(idBytes))
			throw new NotFoundException("Usuario no encontrado");
		userRepository.deleteById(idBytes);
	}

    public UserDto updateAvatar(UUID userId, ChangeAvatarRequest req) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        user.setAvatar(req.avatar());
        userRepository.save(user);
        return UserMapper.toDto(user);
    }

    public Byte getStatus(UUID userId) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));;
        return user.getGlobalStatus();
    }

    public void updateStatus(UUID userId, Byte status) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));;
        user.setGlobalStatus(status);
        userRepository.save(user);
    }

    public Byte getRole(UUID userId) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));;
        return user.getGlobalRole();
    }

    public void updateRole(UUID userId, Byte role) {
        User user = userRepository.findById(UuidUtil.uuidToBin(userId))
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));;
        user.setGlobalRole(role);
        userRepository.save(user);
    }

    public boolean exists(UUID userId) {
        return userRepository.existsById(UuidUtil.uuidToBin(userId));
    }
}
