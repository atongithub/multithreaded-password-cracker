package com.passwordcracker.repository;

import com.passwordcracker.model.CrackingJob;
import com.passwordcracker.model.Result;

public interface ResultRepository {
    /**
     * Creates a new job record in the 'jobs' table.
     * @param job The job object to save
     * @return The auto-generated job ID
     */
    Long createJob(CrackingJob job);

    /**
     * Updates the status of an existing job in the 'jobs' table.
     * @param jobId The ID of the job to update
     * @param status The new status string (e.g., "FOUND", "FAILED")
     */
    void updateJobStatus(Long jobId, String status);

    /**
     * Saves the final result to the 'results' table.
     * @param result The result object to save
     */
    void saveResult(Result result);

    /**
     * Retrieves a result from the 'results' table by its job ID.
     * @param jobId The ID of the job
     * @return The Result object
     */
    Result getResultByJobId(Long jobId);

    /**
     * Retrieves the current status from the 'jobs' table by its job ID.
     * @param jobId The ID of the job
     * @return The status string
     */
    String getJobStatus(Long jobId); // This is the new method
}
