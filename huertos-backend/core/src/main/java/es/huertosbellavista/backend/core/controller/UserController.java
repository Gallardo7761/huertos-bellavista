package es.huertosbellavista.backend.core.controller;

import java.util.List;
import java.util.UUID;

import es.huertosbellavista.backend.core.mapper.CredentialMapper;
import es.huertosbellavista.backend.core.model.Credential;
import es.huertosbellavista.backend.core.service.CredentialService;
import net.miarma.backlib.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import es.huertosbellavista.backend.core.mapper.UserMapper;
import es.huertosbellavista.backend.core.model.User;
import net.miarma.backlib.security.JwtService;
import es.huertosbellavista.backend.core.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	private UserService userService;
	private CredentialService credentialService;
	private JwtService jwtService;
	
	public UserController(UserService userService, CredentialService credentialService, JwtService jwtService) {
		this.userService = userService;
		this.credentialService = credentialService;
		this.jwtService = jwtService;
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<UserDto>> getAll() {
		return ResponseEntity.ok(
			userService.getAll()
				.stream()
				.map(UserMapper::toDto)
				.toList()
		);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<UserDto> create(@RequestBody CreateUserDto dto) {
		return ResponseEntity.ok(
			UserMapper.toDto(
				userService.create(
					UserMapper.fromCreateDto(dto)))
		);
	}

	@GetMapping("/{user_id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<UserDto> getById(@PathVariable("user_id") UUID userId) {
		User user = userService.getById(userId);
		return ResponseEntity.ok(UserMapper.toDto(user));
	}

	@GetMapping("/service/{service_id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<UserWithCredentialDto>> getAllWithCredentials(
		@PathVariable("service_id") Byte serviceId
	) {
		List<Credential> credentials = credentialService.getByServiceIdFetchUser(serviceId);

		List<UserWithCredentialDto> result = credentials.stream()
			.map(cred -> new UserWithCredentialDto(
				UserMapper.toDto(cred.getUser()),
				CredentialMapper.toDto(cred)
			))
			.toList();

		return ResponseEntity.ok(result);
	}
	
	@GetMapping("/{user_id}/service/{service_id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<UserWithCredentialDto> getByIdWithCredentials(
			@PathVariable("user_id") UUID userId,
			@PathVariable("service_id") Byte serviceId
	) {
		User user = userService.getById(userId);
		Credential credential = credentialService.getByUserIdAndService(userId, serviceId);
		return ResponseEntity.ok(
			UserMapper.toDtoWithCredentials(
				UserMapper.toDto(user),
				CredentialMapper.toDto(credential)
			)
		);
	}

	@PutMapping("/{user_id}")
	@PreAuthorize("hasRole('ADMIN') or #userId == principal.userId")
	public ResponseEntity<UserDto> update(
			@PathVariable("user_id") UUID userId,
			@RequestBody UserDto dto
	) {
		User updated = userService.update(userId, UserMapper.fromDto(dto));
		return ResponseEntity.ok(UserMapper.toDto(updated));
	}

	@GetMapping("/{user_id}/avatar")
	public ResponseEntity<String> getAvatar(@PathVariable("user_id") UUID userId) {
		return ResponseEntity.ok(userService.getById(userId).getAvatar());
	}

	@PutMapping("/{user_id}/avatar")
	public ResponseEntity<UserDto> updateAvatar(@PathVariable("user_id") UUID userId, @RequestBody ChangeAvatarRequest avatar) {
		return ResponseEntity.ok(userService.updateAvatar(userId, avatar));
	}

	@GetMapping("/{user_id}/status")
	public ResponseEntity<Byte> getStatus(@PathVariable("user_id") UUID userId) {
		return ResponseEntity.ok(userService.getStatus(userId));
	}

	@PutMapping("/{user_id}/status")
	public ResponseEntity<Void> updateStatus(
			@PathVariable("user_id") UUID userId,
			@RequestBody ChangeStatusRequest req
	) {
		userService.updateStatus(userId, req.status());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{user_id}/role")
	public ResponseEntity<Byte> getRole(@PathVariable("user_id") UUID userId) {
		return ResponseEntity.ok(userService.getRole(userId));
	}

	@PutMapping("/{user_id}/role")
	public ResponseEntity<Void> updateRole(
			@PathVariable("user_id") UUID userid,
			@RequestBody ChangeRoleRequest req
	) {
		userService.updateRole(userid, req.role());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{user_id}/exists")
	public ResponseEntity<UserExistsResponse> exists(@PathVariable("user_id") UUID userId) {
		boolean exists = userService.exists(userId);
		return ResponseEntity.ok(new UserExistsResponse(exists));
	}
	
	@GetMapping("/me")
	public ResponseEntity<UserDto> getMe(@RequestHeader("Authorization") String authHeader) {
	    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    String token = authHeader.substring(7);

	    UUID userId;
	    try {
	        userId = jwtService.getUserId(token); 
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    User user = userService.getById(userId);
	    return ResponseEntity.ok(UserMapper.toDto(user));
	}

	@DeleteMapping("/{user_id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> delete(@PathVariable("user_id") UUID userId) {
		userService.delete(userId);
		return ResponseEntity.ok().build();
	}
}
