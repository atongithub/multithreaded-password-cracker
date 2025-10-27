package com.passwordcracker.wordlist;

import java.io.IOException;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface WordlistReader {
    /**
     * Stream words (lines) from the given wordlist path.
     * Caller is responsible for closing the Stream.
     */
    Stream<String> streamWords(Path path) throws IOException;
}
