package es.huertosbellavista.backend.huertos.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "huertos_user_metadata")
public class UserMetadata {

	@Id
    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private byte[] userIdBin;

	@Transient
	private UUID userId;

    @Column(name = "member_number", nullable = false, unique = true)
    private Integer memberNumber;

    @Column(name = "plot_number", nullable = false)
    private Integer plotNumber;

    @Column(name = "dni", nullable = false, unique = true, length = 9)
    private String dni;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "type", nullable = false)
    private Byte type;

    @Column(name = "role", nullable = false)
    private Byte role;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "assigned_at")
    private Instant assignedAt;

    @Column(name = "deactivated_at")
    private Instant deactivatedAt;

	@PrePersist
	@PreUpdate
	private void prePersist() {
		if (userId != null) {
			userIdBin = UuidUtil.uuidToBin(userId);
		}
	}

	@PostLoad
	private void postLoad() {
		if (userIdBin != null) {
			userId = UuidUtil.binToUUID(userIdBin);
		}
	}


	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public Integer getMemberNumber() {
		return memberNumber;
	}

	public void setMemberNumber(Integer memberNumber) {
		this.memberNumber = memberNumber;
	}

	public Integer getPlotNumber() {
		return plotNumber;
	}

	public void setPlotNumber(Integer plotNumber) {
		this.plotNumber = plotNumber;
	}

	public String getDni() {
		return dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Byte getType() {
		return type;
	}

	public void setType(Byte type) {
		this.type = type;
	}

	public Byte getRole() {
		return role;
	}

	public void setRole(Byte role) {
		this.role = role;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getAssignedAt() {
		return assignedAt;
	}

	public void setAssignedAt(Instant assignedAt) {
		this.assignedAt = assignedAt;
	}

	public Instant getDeactivatedAt() {
		return deactivatedAt;
	}

	public void setDeactivatedAt(Instant deactivatedAt) {
		this.deactivatedAt = deactivatedAt;
	}

	public void setUserIdBin(byte[] userIdBin) {
		this.userIdBin = userIdBin;
	}
}
