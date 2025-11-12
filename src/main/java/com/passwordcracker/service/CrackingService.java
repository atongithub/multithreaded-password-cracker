package com.passwordcracker.service;

import com.passwordcracker.cracker.Cracker;
import com.passwordcracker.model.CrackingJob;
import com.passwordcracker.model.Result;
import com.passwordcracker.repository.ResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * This service class acts as the central coordinator for the cracking process.
 * It's injected into the controller and uses the Cracker and Repository components
 * to execute the logic.
 */
@Service
public class CrackingService {

    private static final Logger log = LoggerFactory.getLogger(CrackingService.class);

    private final Cracker cracker;
    private final WordlistService wordlistService;
    private final ResultRepository resultRepository;

    @Autowired
    public CrackingService(@Qualifier("multiThreadedCracker") Cracker cracker, // We specify the multi-threaded bean
                           WordlistService wordlistService,
                           ResultRepository resultRepository) {
        this.cracker = cracker;
        this.wordlistService = wordlistService;
        this.resultRepository = resultRepository;
    }


    public Long startJob(String filename, String wordlist, Path targetFile) {
        log.info("Resolving wordlist type: {}", wordlist);
        // 1. Find and validate the wordlist path
        Path wordlistPath = wordlistService.resolveWordlist(wordlist);

        log.info("Creating job record in database...");
        // 2. Create a new job record in the 'jobs' table with "STARTED" status
        CrackingJob job = new CrackingJob(filename, wordlist, "STARTED");
        Long jobId = resultRepository.createJob(job);

        // Record start time to calculate total duration
        long startTime = System.currentTimeMillis();

        // 3. Start the asynchronous cracking process
        log.info("Starting async cracker for job ID: {}", jobId);
        CompletableFuture<Optional<String>> crackFuture = cracker.crack(wordlistPath, targetFile, jobId);
        // 4. Add a callback to handle the result when it's ready
        // This 'whenComplete' block runs in the future, when the cracker finishes
        crackFuture.whenComplete((passwordOpt, error) -> {
            try {
                if (error != null) {
                    // Handle any exception during cracking
                    log.error("Job {} failed with an exception: {}", jobId, error.getMessage(), error);
                    resultRepository.updateJobStatus(jobId, "FAILED");
                } else if (passwordOpt.isPresent()) {
                    // --- PASSWORD FOUND ---
                    long timeTaken = System.currentTimeMillis() - startTime;
                    log.info("Job {} SUCCESS: Password found in {} ms", jobId, timeTaken);
                    
                    // Create and save the result to the 'results' table
                    Result result = new Result(jobId, passwordOpt.get(), timeTaken);
                    resultRepository.saveResult(result);
                    
                    // Update the job status to "FOUND"
                    resultRepository.updateJobStatus(jobId, "FOUND");
                } else {
                    // --- PASSWORD NOT FOUND ---
                    log.info("Job {} COMPLETE: Password not found in wordlist.", jobId);
                    // Update job status to "NOT_FOUND"
                    resultRepository.updateJobStatus(jobId, "NOT_FOUND");
                }
            } catch (Exception e) {
                // Catch any errors from database updates
                log.error("Failed to update database for job {}: {}", jobId, e.getMessage(), e);
                resultRepository.updateJobStatus(jobId, "DB_ERROR");
            }
        });

        // 5. Return the job ID to the user immediately
        return jobId;
    }

    /**
     * Gets the final result of a completed job from the 'results' table.
     *
     * @param jobId The ID of the job to check
     * @return The Result object if found, or null if no result exists (e.g., still running or not found)
     */
    public Result getResult(Long jobId) {
        try {
            // This queries the 'results' table
            return resultRepository.getResultByJobId(jobId);
        } catch (EmptyResultDataAccessException e) {
            // This is expected if the job isn't finished or found nothing
            return null;
        }
    }

    /**
     * Gets the current status of any job from the 'jobs' table.
     *
     * @param jobId The ID of the job to check
     * @return The status string (e.g., "STARTED", "FOUND", "NOT_FOUND", "FAILED")
     */
    public String getStatus(Long jobId) {
        try {
            // This queries the 'jobs' table
            return resultRepository.getJobStatus(jobId);
        } catch (EmptyResultDataAccessException e) {
            // This means no job with that ID was ever created
            return "INVALID_ID";
        }
    }
}
