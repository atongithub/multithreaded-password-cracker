package com.passwordcracker.cracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import java.util.concurrent.CompletionException;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicBoolean;

@Component("singleThreadedCracker") // Named the bean
public class SingleThreadedCracker implements Cracker {

    private static final Logger log = LoggerFactory.getLogger(SingleThreadedCracker.class);
    private final ConcurrentMap<Long, AtomicBoolean> activeJobs = new ConcurrentHashMap<>();

    @Override
    public CompletableFuture<Optional<String>> crack(Path wordlistPath, Path targetFile, Long jobId) {
        log.info("JOB_START (Single-threaded): Starting job ID {}", jobId);

        AtomicBoolean cancelled = new AtomicBoolean(false);
        if (activeJobs.putIfAbsent(jobId, cancelled) != null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Job ID " + jobId + " already exists."));
        }

        CompletableFuture<Optional<String>> resultFuture = CompletableFuture.supplyAsync(() -> {
            try (BufferedReader reader = Files.newBufferedReader(wordlistPath)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (cancelled.get()) {
                        log.warn("JOB_CANCELLED (Single-threaded): Job {} was cancelled.", jobId);
                        return Optional.empty(); // Job was cancelled
                    }

                    try {
                        ZipFile zipFile = new ZipFile(targetFile.toFile(), line.toCharArray());
                        // Test if the password is correct by trying to access file headers
                        zipFile.getFileHeaders();

                        // If no exception, the password is correct
                        log.info("FOUND (Single-threaded): Password found for job {}", jobId);
                        return Optional.of(line); // Password found!

                    } catch (ZipException e) {
                        // ZipException indicates wrong password, continue to next line
                    } catch (IOException ioEx) {
                        // Handle potential IO errors reading the zip file itself
                        log.error("JOB_FAILED (Single-threaded): IO error reading target file for job {}", jobId, ioEx);
                        throw new CompletionException(ioEx);
                    } catch (RuntimeException rtEx) {
                        // Catch any other unexpected runtime errors
                        log.error("JOB_FAILED (Single-threaded): Unexpected error during cracking for job {}", jobId, rtEx);
                        throw new CompletionException(rtEx);
                    }
                }
            } catch (IOException e) {
                log.error("JOB_FAILED (Single-threaded): Error reading wordlist for job {}", jobId, e);
                // Propagate exception to the future
                throw new CompletionException(e);
            }

            log.info("JOB_COMPLETE (Single-threaded): Job {} finished. Password not found.", jobId);
            return Optional.empty(); // Not found
        });

        // Clean up when done
        resultFuture.whenComplete((res, err) -> activeJobs.remove(jobId));

        return resultFuture;
    }

    @Override
    public void cancel(Long jobId) {
        AtomicBoolean cancelledFlag = activeJobs.get(jobId);
        if (cancelledFlag != null) {
            cancelledFlag.set(true); // Signal the running loop to stop
        }
    }
}