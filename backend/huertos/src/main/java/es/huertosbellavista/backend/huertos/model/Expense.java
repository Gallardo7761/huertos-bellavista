package es.huertosbellavista.backend.huertos.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "huertos_expenses")
public class Expense {

	@Id
    @Column(name = "expense_id", columnDefinition = "BINARY(16)")
    private byte[] expenseIdBin;

	@Transient
	private UUID expenseId;

    @Column(name = "concept", nullable = false, length = 128)
    private String concept;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "supplier", nullable = false, length = 128)
    private String supplier;

    @Column(name = "invoice", nullable = false, length = 32)
    private String invoice;

    @Column(name = "type")
    private Byte type;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

	@PrePersist
	@PreUpdate
	private void prePersist() {
		if (expenseId != null) {
			expenseIdBin = UuidUtil.uuidToBin(expenseId);
		}
	}

	@PostLoad
	private void postLoad() {
		if (expenseIdBin != null) {
			expenseId = UuidUtil.binToUUID(expenseIdBin);
		}
	}

	public UUID getExpenseId() {
		return expenseId;
	}

	public void setExpenseId(UUID expenseId) {
		this.expenseId = expenseId;
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

	public String getSupplier() {
		return supplier;
	}

	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}

	public String getInvoice() {
		return invoice;
	}

	public void setInvoice(String invoice) {
		this.invoice = invoice;
	}

	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}  
}
