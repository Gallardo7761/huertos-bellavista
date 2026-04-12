package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.RequestMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestMetadataRepository extends JpaRepository<RequestMetadata, Long> {
}
