package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.client.CoreAuthClient;
import es.huertosbellavista.backend.huertos.dto.HuertosLoginResponse;
import es.huertosbellavista.backend.huertos.mapper.UserMetadataMapper;
import es.huertosbellavista.backend.huertos.model.UserMetadata;
import es.huertosbellavista.backend.huertos.service.UserMetadataService;
import net.miarma.backlib.dto.LoginRequest;
import net.miarma.backlib.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class HuertosAuthController {
    private final UserMetadataService metadataService;
    private final CoreAuthClient authClient;

    public HuertosAuthController(UserMetadataService metadataService,
                                 CoreAuthClient authClient) {
        this.metadataService = metadataService;
        this.authClient = authClient;
    }

    @PostMapping("/login")
    public ResponseEntity<HuertosLoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse coreResponse = authClient.login(req);
        UserMetadata metadata = metadataService.getById(coreResponse.user().getUserId());
        return ResponseEntity.ok(
            new HuertosLoginResponse(
                coreResponse.token(),
                coreResponse.user(),
                coreResponse.account(),
                UserMetadataMapper.toDto(metadata)
            )
        );
    }
}
