package es.huertosbellavista.backend.huertos.service;

import es.huertosbellavista.backend.huertos.common.TriTuple;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class EmailExportService {
    @Value("${mail.list.path:/tmp/email}")
    private Path LAST_EMAIL_LIST_PATH;

    public String generateCsv(List<TriTuple<String, Integer, String>> contacts) {
        StringBuilder sb = new StringBuilder();
        sb.append("name,member_number,email\n");
        for (TriTuple<String, Integer, String> c : contacts) {
            sb.append(String.format("\"%s\",%d,%s\n", c.first(), c.second(), c.third()));
        }
        return sb.toString();
    }

    public List<String> loadLastSnapshot() {
        if (!Files.exists(LAST_EMAIL_LIST_PATH)) {
            return Collections.emptyList();
        }
        try(Stream<String> lines = Files.lines(LAST_EMAIL_LIST_PATH)) {
            return lines
                    .skip(1)
                    .map(line -> line.split(",")[2])
                    .collect(Collectors.toList());
        } catch (IOException e) {
            return Collections.emptyList();
        }
    }

    public void saveSnapshot(String csvContent) throws IOException {
        if (LAST_EMAIL_LIST_PATH.getParent() != null) {
            Files.createDirectories(LAST_EMAIL_LIST_PATH.getParent());
        }
        Files.writeString(LAST_EMAIL_LIST_PATH, csvContent, StandardCharsets.UTF_8);
    }

    public List<TriTuple<String, Integer, String>> getNewContacts(
            List<TriTuple<String, Integer, String>> current,
            List<String> lastEmails) {

        return current.stream()
            .filter(contact -> !lastEmails.contains(contact.third()))
            .collect(Collectors.toList());
    }
}