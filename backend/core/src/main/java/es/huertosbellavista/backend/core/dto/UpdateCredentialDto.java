package es.huertosbellavista.backend.core.dto;

import java.util.UUID;

public class UpdateCredentialDto {
    private String email;
    private String username;
    private Byte status;

    public UpdateCredentialDto() { }

    public UpdateCredentialDto(String email, String username, Byte status) {
        this.email = email;
        this.username = username;
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }
}
