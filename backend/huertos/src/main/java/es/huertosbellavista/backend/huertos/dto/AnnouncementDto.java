package es.huertosbellavista.backend.huertos.dto;

import java.time.Instant;
import java.util.UUID;

public class AnnouncementDto {
    public static class Request {
        private String body;
        private Byte priority;
        private UUID publishedBy;

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
    }

    public static class Response {
        private UUID announceId;
        private String body;
        private Byte priority;
        private UUID publishedBy;
        private String publishedByName;
        private Instant createdAt;

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

        public String getPublishedByName() { return publishedByName; }

        public void setPublishedByName(String publishedByName) { this.publishedByName = publishedByName; }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
