package com.passwordcracker.cracker;

import java.nio.file.Path;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * Defines the interface that we need for the cracking programs
 * It is designed to be asynchronous and cancellable.
 */
public interface Cracker {

    /**
     * Starts a new cracking job
     *
     * @param wordlistPath is the path to the wordlist file
     * @param targetFile   is the path to the encrypted target file (e.g., the .zip file)
     * @param jobId        - a unique ID for this job
     * @return a CompletableFuture that will complete with the found password or an empty Optional
     */
    CompletableFuture<Optional<String>> crack(Path wordlistPath, Path targetFile, Long jobId);

    /**
     * Attempts to cancel a running job
     *
     * @param jobId The ID of the job to cancel
     */
    void cancel(Long jobId);
}
