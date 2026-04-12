package es.huertosbellavista.backend.huertos.model.view;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Immutable
@Table(name = "v_incomes_with_info")
public class VIncomesWithInfo {

    @Id
    @Column(name = "income_id", columnDefinition = "BINARY(16)")
    private byte[] incomeIdBin;

    @Transient
    private UUID incomeId;

    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private byte[] userIdBin;

    @Transient
    private UUID userId;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "member_number")
    private Integer memberNumber;

    private String concept;
    private BigDecimal amount;
    private Byte type;
    private Byte frequency;

    @Column(name = "created_at")
    private Instant createdAt;

    @PostLoad
    private void postLoad() {
        if (userIdBin != null) {
            userId = UuidUtil.binToUUID(userIdBin);
        }

        if (incomeIdBin != null) {
            incomeId = UuidUtil.binToUUID(incomeIdBin);
        }
    }

    public UUID getIncomeId() {
        return incomeId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Integer getMemberNumber() { return memberNumber; }

    public String getConcept() {
        return concept;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Byte getType() {
        return type;
    }

    public Byte getFrequency() {
        return frequency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
