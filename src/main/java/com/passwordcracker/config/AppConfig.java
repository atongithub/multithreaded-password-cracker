package com.passwordcracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class AppConfig {

    @Bean(destroyMethod = "shutdown")
    public ExecutorService taskExecutor() {
        // Thread pool with size equal to available processors; ensure it's shutdown on context close
        int cores = Runtime.getRuntime().availableProcessors();
        return Executors.newFixedThreadPool(cores);
    }
}