package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, byte[]> {
    @Query("""
        SELECT r FROM Request r
        LEFT JOIN FETCH r.metadata
        WHERE r.requestIdBin = :id
    """)
    Optional<Request> findByIdWithMetadata(@Param("id") byte[] id);

    boolean existsByHash(String hash);
}
