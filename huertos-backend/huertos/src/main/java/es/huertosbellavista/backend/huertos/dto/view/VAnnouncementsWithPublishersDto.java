package es.huertosbellavista.backend.huertos.dto.view;

import java.time.Instant;
import java.util.UUID;

public class VAnnouncementsWithPublishersDto {
    private UUID announcementId;
    private String title;
    private String body;
    private Byte priority;
    private UUID publishedBy;
    private String publisherPosition;
    private Instant createdAt;

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

    public String getPublisherPosition() {
        return publisherPosition;
    }

    public void setPublisherPosition(String publisherPosition) {
        this.publisherPosition = publisherPosition;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
