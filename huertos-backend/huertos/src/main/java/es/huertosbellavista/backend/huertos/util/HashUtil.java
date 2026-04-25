package es.huertosbellavista.backend.huertos.util;

import es.huertosbellavista.backend.huertos.model.Request;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public class HashUtil {
    public static String hashRequest(Request request) {
        try {
            String input = request.getType().toString() +
                    request.getMetadata().toString();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encoded);
        } catch(NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generando hash de la solicitud", e);
        }
    }
}
