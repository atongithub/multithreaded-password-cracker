package com.passwordcracker.model;

import java.time.Instant;

public class CrackingJob {
    private Long id;
    private String filename;
    private String wordlistType;
    private String status;
    private Instant createdAt;

    public CrackingJob() { this.createdAt = Instant.now(); }

    public CrackingJob(String filename, String wordlistType, String status) {
        this.filename = filename;
        this.wordlistType = wordlistType;
        this.status = status;
        this.createdAt = Instant.now();
    }

    // getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getWordlistType() { return wordlistType; }
    public void setWordlistType(String wordlistType) { this.wordlistType = wordlistType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
