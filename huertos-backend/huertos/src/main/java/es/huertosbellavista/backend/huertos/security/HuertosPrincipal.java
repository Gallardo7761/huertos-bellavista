package es.huertosbellavista.backend.huertos.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class HuertosPrincipal implements UserDetails {

    private final UUID userId;
    private final Byte role;
    private final Byte type;
    private final Byte serviceId;

    public HuertosPrincipal(UUID userId, Byte role, Byte type, Byte serviceId) {
        this.userId = userId;
        this.role = role;
        this.type = type;
        this.serviceId = serviceId;
    }

    public UUID getUserId() { return userId; }
    public Byte getHuertosRole() { return role; }
    public Byte getHuertosType() { return type; }
    public Byte getServiceId() { return serviceId; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> auth = new ArrayList<>();

        String roleName = switch(role) {
            case 0 -> "USER";
            case 1 -> "ADMIN";
            case 2 -> "DEV";
            default -> "USER";
        };

        String typeName = switch(type) {
            case 0 -> "WAIT_LIST";
            case 1 -> "MEMBER";
            case 2 -> "WITH_GREENHOUSE";
            case 3 -> "COLLABORATOR";
            case 4 -> "SUBSIDY";
            case 5 -> "DEVELOPER";
            default -> "WAIT_LIST";
        };

        auth.add(new SimpleGrantedAuthority("ROLE_HUERTOS_ROLE_" + roleName));
        auth.add(new SimpleGrantedAuthority("ROLE_HUERTOS_TYPE_" + typeName));

        return auth;
    }

    @Override public String getPassword() { return ""; }
    @Override public String getUsername() { return userId.toString(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

