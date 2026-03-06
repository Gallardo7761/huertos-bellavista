package es.huertosbellavista.backend.huertos.security;


/**
 * Clase de utilidad para censurar nombres.
 * Censura los nombres dejando las primeras 3 letras visibles y el resto con asteriscos.
 * Si el nombre es muy largo, lo acorta a 16 caracteres y añade "..." al final.
 * @author José Manuel Amador Gallardo
 */
public class NameCensorer {

    public static String censor(String name) {
        if (name == null || name.isBlank()) return "";

        String[] words = name.trim().split("\\s+");

        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int len = word.length();

            if (len > 3) {
                words[i] = word.substring(0, 3) + "*".repeat(len - 3);
            } else if (len > 0) {
                words[i] = word.charAt(0) + "*".repeat(len - 1);
            }
        }

        String censored = String.join(" ", words);

        if (censored.length() > 16) {
            censored = censored.substring(0, 16) + "...";
        }

        return censored;
    }
}