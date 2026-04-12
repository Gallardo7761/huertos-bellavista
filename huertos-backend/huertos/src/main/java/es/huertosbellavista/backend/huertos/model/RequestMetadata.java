package es.huertosbellavista.backend.huertos.model;

import jakarta.persistence.*;
import net.miarma.backlib.util.UuidUtil;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "huertos_request_metadata")
public class RequestMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", columnDefinition = "BINARY(16)", nullable = false, unique = true)
    private byte[] requestIdBin;

    @Transient
    private UUID requestId;

    @OneToOne
    @JoinColumn(name = "request_id", referencedColumnName = "request_id", insertable = false, updatable = false)
    private Request request;

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Column(nullable = false, length = 20)
    private String dni;

    @Column(length = 30)
    private String phone;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 255)
    private String address;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(length = 100)
    private String city;

    @Column(name = "member_number")
    private Integer memberNumber;

    @Column(name = "plot_number")
    private Integer plotNumber;

    @Column(nullable = false, length = 100)
    private String username;

    private Byte type;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    private void prePersist() {
        if (requestId != null) requestIdBin = UuidUtil.uuidToBin(requestId);
    }

    @PostLoad
    private void postLoad() {
        if (requestIdBin != null) requestId = UuidUtil.binToUUID(requestIdBin);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getRequestIdBin() {
        return requestIdBin;
    }

    public void setRequestIdBin(byte[] requestIdBin) {
        this.requestIdBin = requestIdBin;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
