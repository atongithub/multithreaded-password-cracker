package com.passwordcracker.repository;

import com.passwordcracker.model.CrackingJob;
import com.passwordcracker.model.Result;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

import java.util.List;

@Repository
public class JdbcResultRepository implements ResultRepository {

    private final JdbcTemplate jdbc;

    public JdbcResultRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Long createJob(CrackingJob job) {
        String sql = "INSERT INTO jobs (filename, wordlist, status, created_at) VALUES (?, ?, ?, ?)";
        KeyHolder kh = new GeneratedKeyHolder();
        
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, job.getFilename());
            ps.setString(2, job.getWordlistType());
            ps.setString(3, job.getStatus());
            ps.setTimestamp(4, java.sql.Timestamp.from(job.getCreatedAt()));
            return ps;
        }, kh);
        
        // Return the new auto-generated ID
        return kh.getKey().longValue();
    }

    @Override
    public void updateJobStatus(Long jobId, String status) {
        jdbc.update("UPDATE jobs SET status = ? WHERE job_id = ?", status, jobId);
    }

    @Override
    public void saveResult(Result result) {
        jdbc.update("INSERT INTO results (job_id, cracked_password, time_taken_ms) VALUES (?, ?, ?)",
                result.getJobId(), result.getCrackedPassword(), result.getTimeTakenMs());
    }

    @Override
    public Result getResultByJobId(Long jobId) {
        // This query joins the two tables to get all info, but only returns a Result object
        // We're just selecting from 'results' here as defined by the model
        String sql = "SELECT result_id, job_id, cracked_password, time_taken_ms FROM results WHERE job_id = ?";
        
        // queryForObject will throw EmptyResultDataAccessException if no row is found,
        // which is handled by the service layer.
        return jdbc.queryForObject(sql,
                (rs, rowNum) -> {
                    Result r = new Result();
                    r.setId(rs.getLong("result_id"));
                    r.setJobId(rs.getLong("job_id"));
                    r.setCrackedPassword(rs.getString("cracked_password"));
                    r.setTimeTakenMs(rs.getLong("time_taken_ms"));
                    return r;
                }, jobId);
    }

    /**
     * This is the new implementation for the added interface method.
     * It queries the 'jobs' table directly.
     */
    @Override
    public String getJobStatus(Long jobId) {
        String sql = "SELECT status FROM jobs WHERE job_id = ?";
        
        // queryForObject is perfect here, as we expect a single String result
        return jdbc.queryForObject(sql, String.class, jobId);
    }

    /**
     * Retrieves all wordlists from the 'wordlists' table.
     * @return A list of wordlist names
     */
    public List<String> getAllWordlists() {
        String sql = "SELECT DISTINCT list_name FROM wordlists";
        return jdbc.query(sql, (rs, rowNum) -> rs.getString("list_name"));
    }
}
