package es.huertosbellavista.backend.huertos.model;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "huertos_incomes")
public class Income {
	
	@Id
    @Column(name = "income_id", columnDefinition = "BINARY(16)")
    private byte[] incomeIdBin;

	@Transient
	private UUID incomeId;

    @Column(name = "user_id", columnDefinition = "BINARY(16)", nullable = false)
    private byte[] userIdBin;

	@Transient
	private UUID userId;

    @Column(name = "concept", nullable = false, length = 128)
    private String concept;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "type")
    private Byte type;

    @Column(name = "frequency")
    private Byte frequency;

    @Column(name = "created_at", nullable = false, updatable = true)
    private Instant createdAt;

	@PrePersist
	@PreUpdate
	private void prePersist() {
		if (userId != null) {
			userIdBin = UuidUtil.uuidToBin(userId);
		}

		if (incomeId != null) {
			incomeIdBin = UuidUtil.uuidToBin(incomeId);
		}
	}

	@PostLoad
	private void postLoad() {
		if (userIdBin != null) {
			userId = UuidUtil.binToUUID(userIdBin);
		}

		if (incomeIdBin != null) {
			incomeId = UuidUtil.binToUUID(incomeIdBin);
		}
	}

	public boolean isPaid() {
		Instant now = Instant.now();
		if (frequency == 0) { // BIYEARLY
			return Duration.between(createdAt, now).toDays() <= 6L * 30;
		} else if (frequency == 1) { // YEARLY
			return Duration.between(createdAt, now).toDays() <= 12L * 30;
		} else {
			return false;
		}
	}

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
