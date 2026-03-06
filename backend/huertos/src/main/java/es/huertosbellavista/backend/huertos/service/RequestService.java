package es.huertosbellavista.backend.huertos.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import es.huertosbellavista.backend.huertos.validation.RequestValidator;
import net.miarma.backlib.exception.ConflictException;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import es.huertosbellavista.backend.huertos.model.Request;
import es.huertosbellavista.backend.huertos.repository.RequestRepository;
import es.huertosbellavista.backend.huertos.repository.RequestMetadataRepository;
import net.miarma.backlib.exception.BadRequestException;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class RequestService {

    private final RequestRepository requestRepository;
    private final RequestMetadataRepository metadataRepository;

    public RequestService(RequestRepository requestRepository,
                          RequestMetadataRepository metadataRepository) {
        this.requestRepository = requestRepository;
        this.metadataRepository = metadataRepository;
    }

    public List<Request> getAll() {
        return requestRepository.findAll();
    }

    public Request getById(UUID requestId) {
        return requestRepository.findById(UuidUtil.uuidToBin(requestId))
                .orElseThrow(() -> new NotFoundException("Solicitud no encontrada"));
    }

    public List<Request> getByUserId(UUID userId) {
        return requestRepository.findAll().stream()
                .filter(r -> r.getUserId() != null && r.getUserId().equals(userId))
                .toList();
    }

    @Transactional
    public Request create(Request request) {

        if (request == null) {
            throw new BadRequestException("La solicitud es obligatoria");
        }

        if (request.getType() == null) {
            throw new BadRequestException("El tipo de solicitud es obligatorio");
        }

        if (request.getType() == 1 && hasUnregisterRequest(request.getUserId())) {
            throw new ConflictException("Ya tienes una solicitud, espera que se acepte o se elimine al ser rechazada");
        }

        if ((request.getType() == 2 || request.getType() == 3) &&
                hasCollaboratorRequest(request.getUserId())) { // tiene soli de collab
            throw new ConflictException("Ya tienes una solicitud, espera que se acepte o se elimine al ser rechazada");
        }

        if ((request.getType() == 4 || request.getType() == 5) &&
                hasGreenhouseRequest(request.getUserId())) { // tiene soli de invernadero
            throw new ConflictException("Ya tienes una solicitud, espera que se acepte o se elimine al ser rechazada");
        }

        request.setRequestId(UUID.randomUUID());
        request.setCreatedAt(Instant.now());
        request.getMetadata().setRequestId(request.getRequestId());

        if (request.getMetadata() != null) {
            RequestValidator.validate(request.getMetadata(), request.getType());
        }

        return requestRepository.save(request);
    }

    public Request update(UUID requestId, Request changes) {
        Request request = getById(requestId);

        if (changes.getType() != null) request.setType(changes.getType());
        if (changes.getStatus() != null) request.setStatus(changes.getStatus());
        if (changes.getUserId() != null) request.setUserId(changes.getUserId());

        return requestRepository.save(request);
    }

    public Request accept(UUID requestId) {
        byte[] bin = UuidUtil.uuidToBin(requestId);
        Request request = requestRepository.findByIdWithMetadata(bin)
                .orElseThrow(() -> new NotFoundException("Request no encontrada"));
        if (request.getStatus() != 0) {
            throw new BadRequestException("La solicitud ya ha sido procesada");
        }
        request.setStatus((byte)1);
        return requestRepository.save(request);
    }

    public Request reject(UUID requestId) {
        Request request = getById(requestId);
        if (request.getStatus() != 0) {
            throw new BadRequestException("La solicitud ya ha sido procesada");
        }
        request.setStatus((byte)2);
        return requestRepository.save(request);
    }

    public void delete(UUID requestId) {
        UUID id = requestId;
        if (!requestRepository.existsById(UuidUtil.uuidToBin(id))) {
            throw new NotFoundException("Solicitud no encontrada");
        }
        requestRepository.deleteById(UuidUtil.uuidToBin(id));
    }

    public boolean hasGreenhouseRequest(UUID userId) {
        return getByUserId(userId).stream()
                .anyMatch(r -> r.getType() == 4 || r.getType() == 5);
    }

    public boolean hasCollaboratorRequest(UUID userId) {
        return getByUserId(userId).stream()
                .anyMatch(r -> r.getType() == 2 || r.getType() == 3);
    }

    public boolean hasUnregisterRequest(UUID userId) {
        return getByUserId(userId).stream()
                .anyMatch(r -> r.getType() == 1);
    }
}