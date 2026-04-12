package es.huertosbellavista.backend.huertos.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "huertos_announcements")
public class Announcement {
	
	@Id
    @Column(name = "announcement_id", columnDefinition = "BINARY(16)")
    private byte[] announcementIdBin;

	@Transient
	private UUID announcementId;

	@Column(name = "title", nullable = false, columnDefinition = "VARCHAR(128)")
	private String title;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "priority", nullable = false)
    private Byte priority;

	@Column(name = "published_by", columnDefinition = "BINARY(16)", nullable = false)
	private byte[] publishedByBin;

	@Transient
	private UUID publishedBy;

    @CreationTimestamp
    private Instant createdAt;

	@PrePersist
	@PreUpdate
	private void prePersist() {
		if (announcementId != null) {
			announcementIdBin = UuidUtil.uuidToBin(announcementId);
		}

		if (publishedBy != null) {
			publishedByBin = UuidUtil.uuidToBin(publishedBy);
		}
	}

	@PostLoad
	private void postLoad() {
		if (announcementIdBin != null) {
			announcementId = UuidUtil.binToUUID(announcementIdBin);
		}

		if (publishedByBin != null) {
			publishedBy = UuidUtil.binToUUID(publishedByBin);
		}
	}

	public UUID getAnnouncementId() {
		return announcementId;
	}

	public void setAnnouncementId(UUID announcementId) {
		this.announcementId = announcementId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}	
}
