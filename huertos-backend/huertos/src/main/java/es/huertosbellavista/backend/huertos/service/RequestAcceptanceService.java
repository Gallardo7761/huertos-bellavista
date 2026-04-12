package es.huertosbellavista.backend.huertos.service;

import es.huertosbellavista.backend.huertos.client.HuertosWebClient;
import es.huertosbellavista.backend.huertos.mapper.RequestMetadataMapper;
import es.huertosbellavista.backend.huertos.model.Request;
import es.huertosbellavista.backend.huertos.model.RequestMetadata;
import es.huertosbellavista.backend.huertos.model.UserMetadata;
import net.miarma.backlib.dto.UserWithCredentialDto;
import net.miarma.backlib.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RequestAcceptanceService {

    private final RequestService requestService;
    private final UserMetadataService metadataService;
    private final HuertosWebClient huertosWebClient;
    private final MemberService memberService;

    public RequestAcceptanceService(
            RequestService requestService,
            UserMetadataService metadataService,
            HuertosWebClient huertosWebClient,
            MemberService memberService
    ) {
        this.requestService = requestService;
        this.metadataService = metadataService;
        this.huertosWebClient = huertosWebClient;
        this.memberService = memberService;
    }

    public Request acceptRequest(UUID requestId) {
        Request request = requestService.accept(requestId);

        if (request.getMetadata() == null) {
            throw new BadRequestException("No hay metadata asociada");
        }

        return request;
    }

    public void handleSideEffects(Request request) {
        RequestMetadata metadata = request.getMetadata();

        switch (request.getType()) {

            case 0: // REGISTER
                handleRegister(metadata);
                break;

            case 1: // UNREGISTER
                handleUnregister(metadata);
                break;

            case 2: // ADD_COLLABORATOR
                handleAddCollaborator(metadata);
                break;

            case 3: // REMOVE_COLLABORATOR
                handleRemoveCollaborator(metadata);
                break;

            case 4: // ADD_GREENHOUSE
                handleAddGreenhouse(metadata);
                break;

            case 5: // REMOVE_GREENHOUSE
                handleRemoveGreenhouse(metadata);
                break;

            default:
                throw new BadRequestException("Tipo de solicitud no soportado");
        }
    }

    private void handleRegister(RequestMetadata metadata) {
        UserWithCredentialDto createdUser =
                huertosWebClient.createUser(RequestMetadataMapper.toDto(metadata));

        UserMetadata userMetadata = buildBaseUserMetadata(metadata, createdUser.user().getUserId());
        userMetadata.setType((byte) 0); // socio
        userMetadata.setRole((byte) 0);

        metadataService.create(userMetadata);
    }

    private void handleUnregister(RequestMetadata metadata) {
        UserMetadata toRemove = metadataService.getByMemberNumber(metadata.getMemberNumber());
        huertosWebClient.updateCredentialStatus(toRemove.getUserId(), (byte)1, (byte)0);
    }

    private void handleAddCollaborator(RequestMetadata metadata) {
        UserWithCredentialDto newCollab =
                huertosWebClient.createUser(RequestMetadataMapper.toDto(metadata));

        UserMetadata collabMeta = buildBaseUserMetadata(
                metadata,
                newCollab.user().getUserId()
        );

        collabMeta.setType((byte) 3); // colaborador
        collabMeta.setRole((byte) 0);

        metadataService.create(collabMeta);
    }

    private void handleRemoveCollaborator(RequestMetadata metadata) {
        UserMetadata collab = metadataService.getByMemberNumber(metadata.getMemberNumber());
        huertosWebClient.updateCredentialStatus(collab.getUserId(), (byte)1, (byte)0);
    }

    private void handleAddGreenhouse(RequestMetadata metadata) {
        UserMetadata user =
                metadataService.getByMemberNumber(metadata.getMemberNumber());

        user.setType((byte) 2); // invernadero
        metadataService.update(user.getUserId(), user);
    }

    private void handleRemoveGreenhouse(RequestMetadata metadata) {
        UserMetadata user =
                metadataService.getByMemberNumber(metadata.getMemberNumber());

        user.setType((byte) 1); // socio normal
        metadataService.update(user.getUserId(), user);
    }

    private UserMetadata buildBaseUserMetadata(RequestMetadata metadata, UUID userId) {
        UserMetadata um = new UserMetadata();
        um.setUserId(userId);
        um.setMemberNumber(metadata.getMemberNumber());
        um.setPlotNumber(metadata.getPlotNumber());
        um.setDni(metadata.getDni());
        um.setPhone(metadata.getPhone());
        return um;
    }
}
