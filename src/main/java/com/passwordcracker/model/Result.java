package com.passwordcracker.model;

public class Result {
    private Long id;
    private Long jobId;
    private String crackedPassword;
    private long timeTakenMs;

    public Result() {}

    public Result(Long jobId, String crackedPassword, long timeTakenMs) {
        this.jobId = jobId;
        this.crackedPassword = crackedPassword;
        this.timeTakenMs = timeTakenMs;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getCrackedPassword() { return crackedPassword; }
    public void setCrackedPassword(String crackedPassword) { this.crackedPassword = crackedPassword; }
    public long getTimeTakenMs() { return timeTakenMs; }
    public void setTimeTakenMs(long timeTakenMs) { this.timeTakenMs = timeTakenMs; }
}
