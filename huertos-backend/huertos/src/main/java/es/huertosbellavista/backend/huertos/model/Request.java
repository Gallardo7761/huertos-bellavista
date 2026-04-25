package es.huertosbellavista.backend.huertos.model;

import java.time.Instant;
import java.util.UUID;
import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "huertos_requests")
public class Request {

	@Id
	@Column(name = "request_id", columnDefinition = "BINARY(16)")
	private byte[] requestIdBin;

	@Transient
	private UUID requestId;

	@Column(name = "user_id", columnDefinition = "BINARY(16)")
	private byte[] userIdBin;

	@Transient
	private UUID userId;

	private String name;

	@Column(nullable = false)
	private Byte type;

	@Column(nullable = false)
	private Byte status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "hash", unique = true, length = 64)
	private String hash;

	@OneToOne(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
	private RequestMetadata metadata;

	@PrePersist
	private void prePersist() {
		if (requestId != null) requestIdBin = UuidUtil.uuidToBin(requestId);
		if (userId != null) userIdBin = UuidUtil.uuidToBin(userId);
	}

	@PostLoad
	private void postLoad() {
		if (requestIdBin != null) requestId = UuidUtil.binToUUID(requestIdBin);
		if (userIdBin != null) userId = UuidUtil.binToUUID(userIdBin);
	}

	public UUID getRequestId() { return requestId; }
	public void setRequestId(UUID requestId) { this.requestId = requestId; }

	public UUID getUserId() { return userId; }
	public void setUserId(UUID userId) { this.userId = userId; }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Byte getType() { return type; }
	public void setType(Byte type) { this.type = type; }

	public Byte getStatus() { return status; }
	public void setStatus(Byte status) { this.status = status; }

	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

	public RequestMetadata getMetadata() { return metadata; }
	public void setMetadata(RequestMetadata metadata) { this.metadata = metadata; }

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}
}
