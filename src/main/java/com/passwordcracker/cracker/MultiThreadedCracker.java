package com.passwordcracker.cracker;

import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.CopyOnWriteArrayList;

@Component("multiThreadedCracker")
public class MultiThreadedCracker implements Cracker {

    private static final Logger log = LoggerFactory.getLogger(MultiThreadedCracker.class);

    private final ConcurrentMap<Long, JobState> activeJobs = new ConcurrentHashMap<>();
    private final ExecutorService executorService;
    private final int batchSize;

    private record JobState(
            AtomicBoolean found,
            List<Future<?>> workerFutures,
            CompletableFuture<Optional<String>> resultFuture
    ) {
    }

    @Autowired
    public MultiThreadedCracker(ExecutorService executorService,
                                @Value("${cracker.batchSize:5000}") int batchSize) {
        this.executorService = executorService;
        this.batchSize = batchSize;
    }

    @Override
    public CompletableFuture<Optional<String>> crack(Path wordlistPath, Path targetFile, Long jobId) {
        log.info("JOB_START (Multi-threaded): Starting job ID {}", jobId);

        JobState jobState = new JobState(
                new AtomicBoolean(false),
                new CopyOnWriteArrayList<>(),
                new CompletableFuture<>()
        );

        if (activeJobs.putIfAbsent(jobId, jobState) != null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Job ID " + jobId + " already exists."));
        }

        CompletableFuture.runAsync(() -> {
            try (BufferedReader reader = Files.newBufferedReader(wordlistPath)) {
                List<String> batch = new ArrayList<>(batchSize);
                String line;
                while ((line = reader.readLine()) != null) {
                    if (jobState.found().get() || Thread.currentThread().isInterrupted()) break;
                    batch.add(line);
                    if (batch.size() >= batchSize) {
                        submitBatch(new ArrayList<>(batch), targetFile, jobState, jobId);
                        batch.clear();
                    }
                }
                if (!batch.isEmpty() && !jobState.found().get()) {
                    submitBatch(batch, targetFile, jobState, jobId);
                }

                // Wait for worker futures to finish and complete result if not found
                CompletableFuture.runAsync(() -> {
                    for (Future<?> f : jobState.workerFutures()) {
                        try {
                            f.get();
                        } catch (CancellationException | InterruptedException e) {
                            // ignore cancellations/interruption
                        } catch (ExecutionException e) {
                            // If a worker had a real error, propagate it
                            jobState.resultFuture().completeExceptionally(e.getCause());
                            return;
                        }
                    }
                    if (!jobState.found().get()) {
                        log.info("JOB_COMPLETE (Multi-threaded): Job {} finished. Password not found.", jobId);
                        jobState.resultFuture().complete(Optional.empty());
                    }
                }, executorService);

            } catch (IOException e) {
                log.error("JOB_FAILED (Multi-threaded): IO error for job {}", jobId, e);
                jobState.resultFuture().completeExceptionally(e);
            }
        }, executorService);

        jobState.resultFuture().whenComplete((res, err) -> activeJobs.remove(jobId));
        return jobState.resultFuture();
    }

    private void submitBatch(List<String> batch, Path targetFile, JobState jobState, Long jobId) {
        Runnable crackingTask = () -> {
            for (String candidate : batch) {
                // Check if already found by another thread or if cancelled
                if (jobState.found().get() || Thread.currentThread().isInterrupted()) {
                    return;
                }

                try {
                    // Create ZipFile instance with the candidate password
                    ZipFile zipFile = new ZipFile(targetFile.toFile(), candidate.toCharArray());

                    // Attempt to read file headers. If password is correct, this succeeds.
                    // If incorrect, it throws a ZipException.
                    zipFile.getFileHeaders();

                    // --- Password Correct ---
                    // Atomically set 'found' to true if it was false.
                    // Only the first thread to find the password completes the future.
                    if (jobState.found().compareAndSet(false, true)) {
                        log.info("FOUND (Multi-threaded): Password found for job {}", jobId);
                        jobState.resultFuture().complete(Optional.of(candidate));
                    }
                    return; // Password found, stop this worker thread

                } catch (ZipException e) {
                    // --- Wrong Password ---
                    // This is expected, continue to the next candidate password.
                    // Log only if needed for debugging extreme verbosity: log.trace("Job {}: Tried password '{}' - incorrect.", jobId, candidate);
                } catch (IOException ioEx) {
                    // --- Error Reading Zip File ---
                    // Log the error and complete the job exceptionally. Stop this worker.
                    log.error("JOB_FAILED (Multi-threaded): IO error reading target file for job {}: {}", jobId, ioEx.getMessage());
                    jobState.resultFuture().completeExceptionally(ioEx); // Fail the main job future
                    jobState.found().set(true); // Signal other threads to stop (though they might finish current batch)
                    return;
                } catch (RuntimeException rtEx) {
                    // --- Unexpected Error ---
                    // Log the error and complete the job exceptionally. Stop this worker.
                    log.error("JOB_FAILED (Multi-threaded): Unexpected runtime error during cracking for job {}: {}", jobId, rtEx.getMessage(), rtEx);
                    jobState.resultFuture().completeExceptionally(rtEx); // Fail the main job future
                    jobState.found().set(true); // Signal other threads to stop
                    return;
                }
            }
            // If the loop finishes without finding the password in this batch, the worker is done.
        };
        // Submit the task to the executor service and add its Future to the job state
        jobState.workerFutures().add(executorService.submit(crackingTask));
    }

    @Override
    public void cancel(Long jobId) {
        JobState jobState = activeJobs.get(jobId);
        if (jobState != null) {
            log.info("JOB_CANCELLED (Multi-threaded): Attempting to cancel job {}", jobId);
            jobState.workerFutures().forEach(f -> f.cancel(true));
            jobState.resultFuture().cancel(true);
            activeJobs.remove(jobId);
        }
    }
}