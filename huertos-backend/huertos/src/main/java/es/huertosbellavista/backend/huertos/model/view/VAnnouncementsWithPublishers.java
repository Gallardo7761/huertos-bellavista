package es.huertosbellavista.backend.huertos.model.view;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;
import org.hibernate.annotations.Immutable;

import java.time.Instant;
import java.util.UUID;

@Entity
@Immutable
@Table(name = "v_announcements_with_publishers")
public class VAnnouncementsWithPublishers {
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

    private String publisherPosition;

    @Transient
    private UUID publishedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

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

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public Byte getPriority() {
        return priority;
    }

    public String getPublisherPosition() {
        return publisherPosition;
    }

    public UUID getPublishedBy() {
        return publishedBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
