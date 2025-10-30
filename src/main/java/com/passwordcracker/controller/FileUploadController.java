package com.passwordcracker.controller;

import com.passwordcracker.service.CrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);
    private final CrackingService crackingService;

    public FileUploadController(CrackingService crackingService) {
        this.crackingService = crackingService;
    }

    /**
     * Uploads a file (stored temporarily) and starts a cracking job.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndStart(@RequestParam("file") MultipartFile file,
                                            @RequestParam("wordlist") String wordlist) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiError("Empty file"));
        }

        Path targetFile;
        try {
            Path tempDir = Files.createTempDirectory("cracker-job-");
            targetFile = tempDir.resolve(file.getOriginalFilename());
            file.transferTo(targetFile);
            log.info("Received file '{}', saved to temporary path: {}", file.getOriginalFilename(), targetFile);
        } catch (IOException e) {
            log.error("Failed to store temporary file", e);
            return ResponseEntity.internalServerError().body(new ApiError("Failed to store file: " + e.getMessage()));
        }

        // Validate wordlist exists before starting job
        try {
            Long jobId = crackingService.startJob(file.getOriginalFilename(), wordlist, targetFile);
            return ResponseEntity.ok().body(new ApiResponse("Job started", jobId));
        } catch (IllegalArgumentException e) {
            log.error("Wordlist error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error starting job", e);
            return ResponseEntity.internalServerError().body(new ApiError("Unexpected error: " + e.getMessage()));
        }
    }

    // Helper classes for structured error responses
    static class ApiError {
        public final String error;
        public ApiError(String error) { this.error = error; }
    }
    static class ApiResponse {
        public final String message;
        public final Object data;
        public ApiResponse(String message, Object data) { this.message = message; this.data = data; }
    }

    /**
     * Retrieves the result of a cracking job by job ID.
     */
    @GetMapping("/result/{jobId}")
    public ResponseEntity<?> getResult(@PathVariable Long jobId) {
        var result = crackingService.getResult(jobId);
        if (result == null) {
            return ResponseEntity.status(404).body("Result not found or job still in progress.");
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<?> getStatus(@PathVariable Long jobId) {
        String s = crackingService.getStatus(jobId);
        return ResponseEntity.ok(s);
    }
}
