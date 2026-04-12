package es.huertosbellavista.backend.huertos.validation;

import es.huertosbellavista.backend.huertos.model.RequestMetadata;
import net.miarma.backlib.exception.BadRequestException;
import net.miarma.backlib.exception.ValidationException;

import java.util.regex.Pattern;

public class RequestValidator {

    private static final Pattern DNI_PATTERN = Pattern.compile("\\d{8}[A-Za-z]");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?\\d{9,15}$");

    public static void validate(RequestMetadata metadata, Byte requestType) {
        if (metadata.getRequestId() == null) {
            throw new BadRequestException("Estos metadatos deben pertenecer a una solicitud (falta ID)");
        }

        if (isBlank(metadata.getDisplayName())) {
            throw new BadRequestException("El nombre a mostrar es obligatorio");
        } else if (metadata.getDisplayName().length() < 3) {
            throw new ValidationException("displayName", "El nombre a mostrar debe tener al menos 3 caracteres");
        }

        if (isBlank(metadata.getDni())) {
            throw new BadRequestException("El DNI es obligatorio");
        } else if (!DNI_PATTERN.matcher(metadata.getDni()).matches()) {
            throw new ValidationException("dni", "Formato de DNI inválido (ej: 12345678A)");
        } else if (!DniValidator.isValid(metadata.getDni())) {
            throw new ValidationException("dni", "Este DNI no es un DNI real");
        }

        if (isBlank(metadata.getEmail())) {
            throw new BadRequestException("El email es obligatorio");
        } else if (!EMAIL_PATTERN.matcher(metadata.getEmail()).matches()) {
            throw new ValidationException("email", "Email inválido");
        }

        if (isBlank(metadata.getUsername())) {
            throw new BadRequestException("El usuario es obligatorio");
        } else if (metadata.getUsername().length() < 3) {
            throw new ValidationException("username", "El usuario debe tener al menos 3 caracteres");
        }

        if (metadata.getType() == null) {
            throw new BadRequestException("El tipo de usuario es obligatorio");
        }

        if (requestType == 2) {
            if (metadata.getPlotNumber() == null) {
                throw new BadRequestException("El colaborador debe tener huerto");
            }
        }

        if (requestType == 0 || requestType == 1) {
            if (metadata.getMemberNumber() == null) {
                throw new BadRequestException("El número de socio es obligatorio");
            }
        }

        if (requestType == 0) {
            if (metadata.getAddress() == null || metadata.getZipCode() == null || metadata.getCity() == null) {
                throw new BadRequestException("La dirección, código postal y ciudad son obligatorios");
            }
        }

        if (requestType == 0) {
            if (isBlank(metadata.getAddress())) {
                throw new ValidationException("address", "La dirección es obligatoria");
            }
            if (isBlank(metadata.getZipCode())) {
                throw new ValidationException("zipCode", "El código postal es obligatorio");
            } else if(metadata.getZipCode().length() < 5) {
                throw new ValidationException("zipCode", "El código postal debe tener 5 dígitos");
            }
            if (isBlank(metadata.getCity())) {
                throw new ValidationException("city", "La ciudad es obligatoria");
            }
        }

        if (metadata.getPhone() != null && !PHONE_PATTERN.matcher(metadata.getPhone()).matches()) {
            throw new ValidationException("phone", "Teléfono inválido (debe tener 9 dígitos)");
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
