package es.huertosbellavista.backend.core.mapper;

import es.huertosbellavista.backend.core.model.File;
import net.miarma.backlib.dto.FileDto;

import java.util.UUID;

public class FileMapper {

    private FileMapper() {}

    public static FileDto.Response toResponse(File file) {
        FileDto.Response res = new FileDto.Response();

        res.setFileId(file.getFileId());
        res.setFileName(file.getFileName());
        res.setFilePath(file.getFilePath());
        res.setMimeType(file.getMimeType());
        res.setUploadedBy(file.getUploadedBy());
        res.setUploadedAt(file.getUploadedAt());
        res.setContext(file.getContext());

        return res;
    }

    public static File toEntity(FileDto.Request req) {
        File file = new File();

        file.setFileId(UUID.randomUUID());
        file.setFileName(req.getFileName());
        file.setFilePath(req.getFilePath());
        file.setMimeType(req.getMimeType());
        file.setUploadedBy(req.getUploadedBy());
        file.setContext(req.getContext());
        return file;
    }
}
