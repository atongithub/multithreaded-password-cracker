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
            return ResponseEntity.badRequest().body("Empty file");
        }

        // We must save the uploaded file to a temporary location
        // so the background threads can access it.
        Path targetFile;
        try {
            // Create a secure temporary directory for this job
            // The OS will clean this up later
            Path tempDir = Files.createTempDirectory("cracker-job-");
            targetFile = tempDir.resolve(file.getOriginalFilename());
            file.transferTo(targetFile);
            log.info("Received file '{}', saved to temporary path: {}", file.getOriginalFilename(), targetFile);
        } catch (IOException e) {
            log.error("Failed to store temporary file", e);
            return ResponseEntity.internalServerError().body("Failed to store file: " + e.getMessage());
        }

        // Start the cracking job, passing the *path* to the saved file
        Long jobId = crackingService.startJob(file.getOriginalFilename(), wordlist, targetFile);
        return ResponseEntity.ok().body("Job started: " + jobId);
    }

    @GetMapping("/result/{jobId}")
    public ResponseEntity<?> getResult(@PathVariable Long jobId) {
        var result = crackingService.getResult(jobId);
        if (result == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<?> getStatus(@PathVariable Long jobId) {
        String s = crackingService.getStatus(jobId);
        return ResponseEntity.ok(s);
    }
}
