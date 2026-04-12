package es.huertosbellavista.backend.huertos.dto;

import java.time.Instant;
import java.util.UUID;

public class RequestDto {
    public static class Request {
        private Byte type;
        private UUID userId;
        private String name;
        private RequestMetadataDto metadata;

        public Byte getType() {
            return type;
        }

        public void setType(Byte type) {
            this.type = type;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public RequestMetadataDto getMetadata() {
            return metadata;
        }

        public void setMetadata(RequestMetadataDto metadata) {
            this.metadata = metadata;
        }
    }

    public static class Response {
        private UUID requestId;
        private Byte type;
        private Byte status;
        private UUID userId;
        private String name;
        private RequestMetadataDto metadata;
        private Instant createdAt;

        public UUID getRequestId() {
            return requestId;
        }

        public void setRequestId(UUID requestId) {
            this.requestId = requestId;
        }

        public Byte getType() {
            return type;
        }

        public void setType(Byte type) {
            this.type = type;
        }

        public Byte getStatus() {
            return status;
        }

        public void setStatus(Byte status) {
            this.status = status;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public RequestMetadataDto getMetadata() {
            return metadata;
        }

        public void setMetadata(RequestMetadataDto metadata) {
            this.metadata = metadata;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
