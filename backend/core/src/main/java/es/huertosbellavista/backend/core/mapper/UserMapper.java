package es.huertosbellavista.backend.core.mapper;

import es.huertosbellavista.backend.core.model.User;
import net.miarma.backlib.dto.CreateUserDto;
import net.miarma.backlib.dto.CredentialDto;
import net.miarma.backlib.dto.UserDto;
import net.miarma.backlib.dto.UserWithCredentialDto;

import java.util.UUID;

public class UserMapper {
    public static User fromDto(UserDto dto) {
        if (dto == null) return null;

        User user = new User();
        user.setDisplayName(dto.getDisplayName());
        user.setAvatar(dto.getAvatar());
        user.setGlobalRole(dto.getGlobalRole());
        user.setGlobalStatus(dto.getGlobalStatus());
        return user;
    }

    public static User fromCreateDto(CreateUserDto dto) {
        User user = new User();
        user.setUserId(UUID.randomUUID());
        user.setDisplayName(dto.displayName());
        user.setAvatar(dto.avatar() != null ? dto.avatar() : null);
        user.setGlobalRole((byte)0);
        user.setGlobalStatus((byte)1);
        return user;
    }

    public static UserDto toDto(User u) {
    	if (u == null) return null;
    	
        return new UserDto(
            u.getUserId(),
            u.getDisplayName(),
            u.getAvatar(),
            u.getGlobalStatus(),
            u.getGlobalRole(),
            u.getCreatedAt(),
            u.getUpdatedAt()
        );
    }

    public static UserWithCredentialDto toDtoWithCredentials(UserDto user, CredentialDto account){
        if (user == null || account == null) return null;

        return new UserWithCredentialDto(user, account);
    }
}
