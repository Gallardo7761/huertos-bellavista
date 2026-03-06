package es.huertosbellavista.backend.core.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import net.miarma.backlib.util.UuidUtil;

@Entity
@Table(name = "files")
public class File {

	@Id
    @Column(name = "file_id", columnDefinition = "BINARY(16)")
    private byte[] fileIdBin;
    
    @Transient
    private UUID fileId;
    
    @Column(name = "file_name", nullable = false, length = 128)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 256)
    private String filePath;

    @Column(name = "mime_type", nullable = false, length = 64)
    private String mimeType;

    @Column(name = "uploaded_by", columnDefinition = "BINARY(16)", nullable = false)
    private byte[] uploadedByBin;
    
    @Transient
    private UUID uploadedBy;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private Instant uploadedAt;

    @Column(name = "context", nullable = false)
    private Byte context;

    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (fileId != null) {
        	fileIdBin = UuidUtil.uuidToBin(fileId);
        }
        
        if (uploadedBy != null) {
        	uploadedByBin = UuidUtil.uuidToBin(uploadedBy);
        }
    }

    @PostLoad
    private void postLoad() {
    	if (fileIdBin != null) {
        	fileId = UuidUtil.binToUUID(fileIdBin);
        }
        
        if (uploadedByBin != null) {
        	uploadedBy = UuidUtil.binToUUID(uploadedByBin);
        }
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public UUID getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(UUID uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public Byte getContext() {
        return context;
    }

    public void setContext(Byte context) {
        this.context = context;
    }
}
