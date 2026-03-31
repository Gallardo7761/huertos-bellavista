package es.huertosbellavista.backend.huertos.model;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "huertos_balance")
public class Balance {
	
	@Id
    private Short year;

    @Column(name = "initial_bank", nullable = false)
    private BigDecimal initialBank;

    @Column(name = "initial_cash", nullable = false)
    private BigDecimal initialCash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

	public Short getYear() {
		return year;
	}

	public void setYear(Short year) {
		this.year = year;
	}

	public BigDecimal getInitialBank() {
		return initialBank;
	}

	public void setInitialBank(BigDecimal initialBank) {
		this.initialBank = initialBank;
	}

	public BigDecimal getInitialCash() {
		return initialCash;
	}

	public void setInitialCash(BigDecimal initialCash) {
		this.initialCash = initialCash;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
}
