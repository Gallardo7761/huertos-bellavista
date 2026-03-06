package es.huertosbellavista.backend.core.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import net.miarma.backlib.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.huertosbellavista.backend.core.model.File;
import es.huertosbellavista.backend.core.repository.FileRepository;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class FileService {

    private final FileRepository fileRepository;

    @Value("${filesDir}")
    private String filesDir;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public File getById(UUID fileId) {
        byte[] idBytes = UuidUtil.uuidToBin(fileId);
        return fileRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Archivo no encontrado"));
    }

    public List<File> getAll() {
        return fileRepository.findAll();
    }

    public List<File> getByUserId(UUID userId) {
        return fileRepository.findByUploadedBy(userId);
    }

    public File create(File file, byte[] fileBinary) throws IOException {
        Path dirPath = Paths.get(filesDir, String.valueOf(file.getContext()));
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        Path filePath = dirPath.resolve(file.getFileName());
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(fileBinary);
        }

        file.setFilePath(filePath.toString());

        return fileRepository.save(file);
    }

    public File update(UUID fileId, File file) {
    	byte[] idBytes = UuidUtil.uuidToBin(fileId);
        if (!fileRepository.existsById(idBytes)) {
            throw new NotFoundException("Archivo no encontrado");
        }
        return fileRepository.save(file);
    }

	public void delete(UUID fileId) {
	    byte[] idBytes = UuidUtil.uuidToBin(fileId);
	    if (!fileRepository.existsById(idBytes)) {
	        throw new NotFoundException("Archivo no encontrado");
	    }
	    fileRepository.deleteById(idBytes);
	}

	public boolean isOwner(UUID fileId, UUID userId) {
	    byte[] fileBytes = UuidUtil.uuidToBin(fileId);
	    return fileRepository.findById(fileBytes)
	            .map(f -> f.getUploadedBy().equals(userId))
	            .orElse(false);
	}
}


