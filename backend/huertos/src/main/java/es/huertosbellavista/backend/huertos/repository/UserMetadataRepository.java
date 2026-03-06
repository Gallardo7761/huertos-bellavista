package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.UserMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserMetadataRepository extends JpaRepository<UserMetadata, byte[]> {
    Optional<UserMetadata> findByMemberNumber(Integer memberNumber);
}
