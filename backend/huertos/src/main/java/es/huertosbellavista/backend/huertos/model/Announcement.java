package es.huertosbellavista.backend.huertos.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "huertos_announces")
public class Announcement {
	
	@Id
    @Column(name = "announce_id", columnDefinition = "BINARY(16)")
    private byte[] announceIdBin;

	@Transient
	private UUID announceId;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "priority", nullable = false)
    private Byte priority;

	@Column(name = "published_by", columnDefinition = "BINARY(16)", nullable = false)
	private byte[] publishedByBin;

	@Transient
	private UUID publishedBy;

	@Column(name = "published_by_name", nullable = false)
	private String publishedByName;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

	@PrePersist
	@PreUpdate
	private void prePersist() {
		if (announceId != null) {
			announceIdBin = UuidUtil.uuidToBin(announceId);
		}

		if (publishedBy != null) {
			publishedByBin = UuidUtil.uuidToBin(publishedBy);
		}
	}

	@PostLoad
	private void postLoad() {
		if (announceIdBin != null) {
			announceId = UuidUtil.binToUUID(announceIdBin);
		}

		if (publishedByBin != null) {
			publishedBy = UuidUtil.binToUUID(publishedByBin);
		}
	}

	public UUID getAnnounceId() {
		return announceId;
	}

	public void setAnnounceId(UUID announceId) {
		this.announceId = announceId;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public Byte getPriority() {
		return priority;
	}

	public void setPriority(Byte priority) {
		this.priority = priority;
	}

	public UUID getPublishedBy() {
		return publishedBy;
	}

	public void setPublishedBy(UUID publishedBy) {
		this.publishedBy = publishedBy;
	}

	public String getPublishedByName() {
		return publishedByName;
	}

	public void setPublishedByName(String publishedByName) {
		this.publishedByName = publishedByName;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}	
}
