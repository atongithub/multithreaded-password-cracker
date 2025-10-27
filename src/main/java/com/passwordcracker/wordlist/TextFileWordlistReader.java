package com.passwordcracker.wordlist;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

@Component
public class TextFileWordlistReader implements WordlistReader {

    @Override
    public Stream<String> streamWords(Path path) throws IOException {
        // Using Files.lines gives a stream which must be closed by the caller
        return Files.lines(path);
    }
}
