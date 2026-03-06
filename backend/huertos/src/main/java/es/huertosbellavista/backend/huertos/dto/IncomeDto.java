package es.huertosbellavista.backend.huertos.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class IncomeDto {
    public static class Request {
        private UUID userId;
        private Integer memberNumber;
        private String concept;
        private BigDecimal amount;
        private Byte type;
        private Byte frequency;
        private Instant createdAt;

        public Integer getMemberNumber() {
            return memberNumber;
        }

        public void setMemberNumber(Integer memberNumber) {
            this.memberNumber = memberNumber;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getConcept() {
            return concept;
        }

        public void setConcept(String concept) {
            this.concept = concept;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public Byte getType() {
            return type;
        }

        public void setType(Byte type) {
            this.type = type;
        }

        public Byte getFrequency() {
            return frequency;
        }

        public void setFrequency(Byte frequency) {
            this.frequency = frequency;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class Response {
        private UUID incomeId;
        private UUID userId;
        private String concept;
        private BigDecimal amount;
        private Byte type;
        private Byte frequency;
        private Instant createdAt;

        public UUID getIncomeId() {
            return incomeId;
        }

        public void setIncomeId(UUID incomeId) {
            this.incomeId = incomeId;
        }

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getConcept() {
            return concept;
        }

        public void setConcept(String concept) {
            this.concept = concept;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public Byte getType() {
            return type;
        }

        public void setType(Byte type) {
            this.type = type;
        }

        public Byte getFrequency() {
            return frequency;
        }

        public void setFrequency(Byte frequency) {
            this.frequency = frequency;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
