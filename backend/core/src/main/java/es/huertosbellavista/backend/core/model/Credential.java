package es.huertosbellavista.backend.core.model;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "credentials", 
       uniqueConstraints = { 
		   @UniqueConstraint(columnNames = { "service_id", "username" }),
	       @UniqueConstraint(columnNames = { "service_id", "email" }) 
	   })

public class Credential {
	
	@Id
	@Column(name = "credential_id", columnDefinition = "BINARY(16)")
	private byte[] credentialIdBin;
	
	@Column(name = "user_id", columnDefinition = "BINARY(16)")
	private byte[] userIdBin;
	
	@Transient
	private UUID credentialId;
	
	@Transient
	private UUID userId;
	
	@Column(name = "service_id")
	private Byte serviceId;
	
	private String username;
	private String email;
	private String password;
	private Byte status;

	@CreationTimestamp
	private Instant createdAt;
	
	@UpdateTimestamp
	private Instant updatedAt;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", insertable = false, updatable = false)
	private User user;

	@PrePersist
    @PreUpdate
    private void prePersist() {
        if (credentialId != null) {
            credentialIdBin = UuidUtil.uuidToBin(credentialId);
        }
        if (userId != null) {
            userIdBin = UuidUtil.uuidToBin(userId);
        }
    }

    @PostLoad
    private void postLoad() {
        if (credentialIdBin != null) {
            credentialId = UuidUtil.binToUUID(credentialIdBin);
        }
        if (userIdBin != null) {
            userId = UuidUtil.binToUUID(userIdBin);
        }
    }

	public UUID getCredentialId() {
		return credentialId;
	}

	public void setCredentialId(UUID credentialId) {
		this.credentialId = credentialId;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public Byte getServiceId() {
		return serviceId;
	}

	public void setServiceId(Byte serviceId) {
		this.serviceId = serviceId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}