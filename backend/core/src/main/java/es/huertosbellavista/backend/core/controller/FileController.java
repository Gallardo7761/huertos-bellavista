package es.huertosbellavista.backend.core.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import es.huertosbellavista.backend.core.mapper.FileMapper;
import net.miarma.backlib.dto.FileDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import es.huertosbellavista.backend.core.model.File;
import es.huertosbellavista.backend.core.service.FileService;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<File>> getAll() {
        List<File> files = fileService.getAll();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/{file_id}")
    @PreAuthorize("hasRole('ADMIN') or @fileService.isOwner(#file_id, authentication.principal.userId)")
    public ResponseEntity<File> getById(@PathVariable("file_id") UUID fileId) {
        File file = fileService.getById(fileId);
        return ResponseEntity.ok(file);
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN') or #uploadedBy == authentication.principal.userId")
    public ResponseEntity<FileDto.Response> create(
            @RequestPart("file") MultipartFile file,
            @RequestPart("fileName") String fileName,
            @RequestPart("mimeType") String mimeType,
            @RequestPart("uploadedBy") UUID uploadedBy,
            @RequestPart("context") Integer context
    ) throws IOException {

        File entity = new File();
        entity.setFileName(fileName);
        entity.setMimeType(mimeType);
        entity.setUploadedBy(uploadedBy);
        entity.setContext(context.byteValue());

        File created = fileService.create(entity, file.getBytes());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(FileMapper.toResponse(created));
    }

    @PutMapping("/{file_id}")
    @PreAuthorize("hasRole('ADMIN') or @fileService.isOwner(#file_id, authentication.principal.userId)")
    public ResponseEntity<File> update(@PathVariable("file_id") UUID fileId, @RequestBody FileDto.Request request) {
        File updated = fileService.update(fileId, FileMapper.toEntity(request));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{file_id}")
    @PreAuthorize("hasRole('ADMIN') or @fileService.isOwner(#file_id, authentication.principal.userId)")
    public ResponseEntity<Void> delete(@PathVariable("file_id") UUID fileId, @RequestBody Map<String,String> body) throws IOException {
        String filePath = body.get("file_path");
        Files.deleteIfExists(Paths.get(filePath));
        fileService.delete(fileId);
        return ResponseEntity.ok().build();
    }
}
