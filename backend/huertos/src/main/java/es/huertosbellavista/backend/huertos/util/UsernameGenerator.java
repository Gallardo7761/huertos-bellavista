package es.huertosbellavista.backend.huertos.util;

import java.util.Locale;

public class UsernameGenerator {
    public static String generate(String name, Integer number) {
        return name.split(" ")[0].toLowerCase() + number;
    }
}
