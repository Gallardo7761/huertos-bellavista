package es.huertosbellavista.backend.core.repository;

import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import es.huertosbellavista.backend.core.model.Credential;

public interface CredentialRepository extends JpaRepository<Credential, byte[]> {

	@Query("""
    	    SELECT c FROM Credential c
    	    JOIN FETCH c.user
    	    WHERE c.serviceId = :serviceId
    	      AND c.username = :username
    	""")
    Optional<Credential> findByServiceIdAndUsername(@Param("serviceId") Byte serviceId,
    												@Param("username") String username);

    List<Credential> findAllByServiceId(Byte serviceId);

    @Query("SELECT c FROM Credential c JOIN FETCH c.user WHERE c.serviceId = :serviceId")
    List<Credential> getByServiceIdFetchUser(@Param("serviceId") Byte serviceId);

    Optional<Credential> findByServiceIdAndEmail(Byte serviceId, String email);

    @Query("SELECT c FROM Credential c WHERE c.userIdBin = :userIdBin AND c.serviceId = :serviceId")
    Optional<Credential> findByUserIdAndServiceId(@Param("userIdBin") byte[] userIdBin, @Param("serviceId") Byte serviceId);
    
    Optional<Credential> findByUsernameAndServiceId(String username, Byte serviceId);
    
    @Query("SELECT c FROM Credential c WHERE c.userIdBin = :userIdBin")
    List<Credential> findByUserId(@Param("userIdBin") byte[] userIdBin);

    @Query("SELECT c FROM Credential c WHERE c.email = :email")
    List<Credential> findByEmail(@Param("email") String email);
    
    boolean existsByUsernameAndServiceId(String username, Byte serviceId);
    
    boolean existsByEmailAndServiceId(String email, Byte serviceId);

    @Modifying
    @Query("""
        UPDATE Credential c
        SET c.username = :username,
            c.email = :email,
            c.status = :status
        WHERE c.credentialIdBin = :credentialIdBin
    """)
    int update(@Param("credentialIdBin") byte[] credentialIdBin,
               @Param("username") String username,
               @Param("email") String email,
               @Param("status") Byte status);

    List<Credential> findByUsername(@NotBlank String username);
}

