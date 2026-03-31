package es.huertosbellavista.backend.huertos.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import net.miarma.backlib.exception.BadRequestException;
import net.miarma.backlib.exception.ConflictException;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.UserMetadata;
import es.huertosbellavista.backend.huertos.repository.UserMetadataRepository;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class UserMetadataService {

    private final UserMetadataRepository repository;

    public UserMetadataService(UserMetadataRepository repository) {
        this.repository = repository;
    }

    public List<UserMetadata> getAll() {
        return repository.findAll();
    }

    @Cacheable("metadataByUserId")
    public UserMetadata getById(UUID userId) {
        byte[] idBytes = UuidUtil.uuidToBin(userId);
        return repository.findById(idBytes)
            .orElseThrow(() -> new NotFoundException("Metadatos de usuario no encontrados"));
    }

    @Cacheable("metadataByMemberNumber")
    public UserMetadata getByMemberNumber(Integer memberNumber) {
        return repository.findByMemberNumber(memberNumber)
            .orElseThrow(() -> new NotFoundException("Metadatos de usuario no encontrados"));
    }

    @Cacheable("metadataExists")
    public boolean existsById(UUID userId) {
        byte[] idBytes = UuidUtil.uuidToBin(userId);
        return repository.existsById(idBytes);
    }

    public UserMetadata create(UserMetadata meta) {
        if (meta.getUserId() == null) {
            throw new BadRequestException("El identificador de usuario es obligatorio");
        }
        if (repository.existsById(UuidUtil.uuidToBin(meta.getUserId()))) {
            throw new ConflictException("Este usuario ya tiene metadatos asociados");
        }

        if (meta.getMemberNumber() == null) throw new BadRequestException("El número de socio es obligatorio");
        if (meta.getPlotNumber() == null) throw new BadRequestException("El número de huerto es obligatorio");
        if (meta.getDni() == null || meta.getDni().isBlank()) throw new BadRequestException("El DNI es obligatorio");
        if (meta.getPhone() == null || meta.getPhone().isBlank()) throw new BadRequestException("El teléfono es obligatorio");
        if (meta.getType() == null) meta.setType((byte) 0);
        if (meta.getRole() == null) meta.setRole((byte) 0);

        meta.setCreatedAt(Instant.now());
        meta.setAssignedAt(null);
        meta.setDeactivatedAt(null);

        return repository.save(meta);
    }

    @CacheEvict(
        value = {
            "metadataByUserId",
            "metadataByMemberNumber",
            "metadataExists"
        },
        key = "#p0"
    )
    public UserMetadata update(UUID userId, UserMetadata changes) {
        byte[] idBytes = UuidUtil.uuidToBin(userId);

        UserMetadata metadata = repository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Metadatos de usuario no encontrados"));

        if (changes.getMemberNumber() != null) metadata.setMemberNumber(changes.getMemberNumber());
        if (changes.getPlotNumber() != null) metadata.setPlotNumber(changes.getPlotNumber());
        if (changes.getDni() != null) metadata.setDni(changes.getDni());
        if (changes.getPhone() != null) metadata.setPhone(changes.getPhone());
        if (changes.getType() != null) metadata.setType(changes.getType());
        if (changes.getRole() != null) metadata.setRole(changes.getRole());
        if (changes.getNotes() != null) metadata.setNotes(changes.getNotes());
        metadata.setAssignedAt(changes.getAssignedAt());
        metadata.setDeactivatedAt(changes.getDeactivatedAt());

        return repository.save(metadata);
    }

    public void delete(UUID userId) {
        byte[] idBytes = UuidUtil.uuidToBin(userId);
        if (!repository.existsById(idBytes)) {
            throw new NotFoundException("Metadatos de usuario no encontrados");
        }
        repository.deleteById(idBytes);
    }

    public Integer getLatestMemberNumber() {
        return repository.findAll()
                .stream()
                .map(UserMetadata::getMemberNumber)
                .max(Integer::compareTo)
                .get();
    }

    public Boolean existsByMemberNumber(Integer memberNumber) {
        return getByMemberNumber(memberNumber).getUserId() != null;
    }
}
