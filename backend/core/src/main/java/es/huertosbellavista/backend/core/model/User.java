package es.huertosbellavista.backend.core.model;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "users")
public class User {
	
	@Id
    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private byte[] userIdBin;
	
	@Transient
    private UUID userId;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    private String avatar;

    @Column(name = "global_status")
    private Byte globalStatus;

    @Column(name = "global_role")
    private Byte globalRole;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
    
    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (userId != null) {
            userIdBin = UuidUtil.uuidToBin(userId);
        }
    }

    @PostLoad
    private void postLoad() {
        if (userIdBin != null) {
            userId = UuidUtil.binToUUID(userIdBin);
        }
    }

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public Byte getGlobalStatus() {
		return globalStatus;
	}

	public void setGlobalStatus(Byte globalStatus) {
		this.globalStatus = globalStatus;
	}

	public Byte getGlobalRole() {
		return globalRole;
	}

	public void setGlobalRole(Byte globalRole) {
		this.globalRole = globalRole;
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
}
