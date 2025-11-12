package com.passwordcracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class WordlistService {

    private final Path baseWordlistDir = Path.of("wordlists"); // relative folder for wordlists

    // Optional JdbcTemplate; if present we will try to read the wordlist from the DB
    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    /**
     * Validates and returns a Path to the requested wordlist.
     * If a `wordlists` table is available in the DB and contains rows for the requested
     * list name, the rows are written to a temporary file and that Path is returned.
     * Otherwise we fall back to the file under the `wordlists` folder on disk.
     */
    public Path resolveWordlist(String type) {
        // If a JdbcTemplate is present, try DB-backed wordlists first
        if (jdbcTemplate != null) {
            try {
                List<String> rows = jdbcTemplate.queryForList(
                        "SELECT word FROM wordlists WHERE list_name = ? ORDER BY id",
                        String.class, type);
                if (rows != null && !rows.isEmpty()) {
                    try {
                        Path tmp = Files.createTempFile("wordlist-", ".txt");
                        Files.write(tmp, rows, StandardCharsets.UTF_8);
                        return tmp;
                    } catch (IOException e) {
                        throw new UncheckedIOException("Failed to write temporary wordlist file", e);
                    }
                }
            } catch (Exception e) {
                // If any DB error occurs, log if needed and fall back to file-based approach.
                // We don't have a logger here to keep changes small; caller will get file-based fallback.
            }
        }

        // Fallback to file system-based wordlist
        Path p = baseWordlistDir.resolve(type + ".txt");
        if (!Files.exists(p) || !Files.isReadable(p)) {
            throw new IllegalArgumentException("Wordlist not found or unreadable: " + p);
        }
        return p;
    }
}
