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
    private final ForkJoinPool forkJoinPool;
    private final int batchSize;

    private record JobState(
            AtomicBoolean found,
            List<Future<?>> workerFutures,
            CompletableFuture<Optional<String>> resultFuture
    ) {
    }

    @Autowired
    public MultiThreadedCracker(@Value("${cracker.batchSize:5000}") int batchSize) {
        this.forkJoinPool = new ForkJoinPool(Runtime.getRuntime().availableProcessors());
        this.batchSize = batchSize;
    }

    @Override
    public CompletableFuture<Optional<String>> crack(Path wordlistPath, Path targetFile, Long jobId) {
        log.info("JOB_START (Optimized Multi-threaded): Starting job ID {}", jobId);

        JobState jobState = new JobState(
                new AtomicBoolean(false),
                new CopyOnWriteArrayList<>(),
                new CompletableFuture<>()
        );

        if (activeJobs.putIfAbsent(jobId, jobState) != null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Job ID " + jobId + " already exists."));
        }

        forkJoinPool.submit(() -> {
            try (BufferedReader reader = Files.newBufferedReader(wordlistPath, java.nio.charset.StandardCharsets.UTF_8)) {
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

                jobState.workerFutures().forEach(f -> {
                    try {
                        f.get();
                    } catch (Exception e) {
                        log.error("Worker error for job {}", jobId, e);
                    }
                });

                if (!jobState.found().get()) {
                    log.info("JOB_COMPLETE (Optimized Multi-threaded): Job {} finished. Password not found.", jobId);
                    jobState.resultFuture().complete(Optional.empty());
                }

            } catch (IOException e) {
                log.error("JOB_FAILED (Optimized Multi-threaded): IO error for job {}", jobId, e);
                jobState.resultFuture().completeExceptionally(e);
            }
        });

        jobState.resultFuture().whenComplete((res, err) -> activeJobs.remove(jobId));
        return jobState.resultFuture();
    }

    private void submitBatch(List<String> batch, Path targetFile, JobState jobState, Long jobId) {
        Runnable crackingTask = () -> {
            for (String candidate : batch) {
                log.debug("Job {}: Trying password candidate: '{}'", jobId, candidate);
                try (ZipFile zipFile = new ZipFile(targetFile.toFile(), candidate.toCharArray())) {
                    // Try to extract the first file entry to really test the password
                    String entryName = zipFile.getFileHeaders().get(0).getFileName();
                    zipFile.extractFile(entryName, System.getProperty("java.io.tmpdir"));

                    log.info("Job {}: Password '{}' succeeded (extracted entry)", jobId, candidate);
                    if (jobState.found().compareAndSet(false, true)) {
                        log.info("FOUND (Multi-threaded): Password found for job {}: {}", jobId, candidate);
                        jobState.resultFuture().complete(Optional.of(candidate));
                    }
                    return;

                } catch (ZipException e) {
                    log.debug("Job {}: Password '{}' failed (ZipException)", jobId, candidate);
                    // Wrong password or not a zip: continue
                } catch (IOException ioEx) {
                    log.error("JOB_FAILED (Multi-threaded): IO error closing ZipFile for job {}: {}", jobId, ioEx.getMessage());
                    jobState.resultFuture().completeExceptionally(ioEx);
                    jobState.found().set(true);
                    return;
                } catch (RuntimeException rtEx) {
                    log.error("JOB_FAILED (Multi-threaded): Unexpected runtime error during cracking for job {}: {}", jobId, rtEx.getMessage(), rtEx);
                    jobState.resultFuture().completeExceptionally(rtEx);
                    jobState.found().set(true);
                    return;
                }
            }
            // If the loop finishes without finding the password in this batch, the worker is done.
        };
        // Submit the task to the executor service and add its Future to the job state
        jobState.workerFutures().add(forkJoinPool.submit(crackingTask));
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