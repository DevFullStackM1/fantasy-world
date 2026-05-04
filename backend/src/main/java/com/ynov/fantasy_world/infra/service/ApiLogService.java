package com.ynov.fantasy_world.infra.service;

import com.ynov.fantasy_world.infra.dao.document.ApiLog;
import com.ynov.fantasy_world.infra.dao.repository.ApiLogRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ApiLogService {

    private final ApiLogRepository apiLogRepository;

    public ApiLogService(ApiLogRepository apiLogRepository) {
        this.apiLogRepository = apiLogRepository;
    }

    public void logSuccess(String httpMethod, String path, Object requestBody, Object responseBody, int statusCode) {
        ApiLog log = buildLog(httpMethod, path, requestBody, statusCode, "INFO");
        log.setResponseBody(responseBody);
        apiLogRepository.save(log);
    }

    public void logClientError(String httpMethod, String path, Object requestBody, int statusCode, String errorMessage) {
        ApiLog log = buildLog(httpMethod, path, requestBody, statusCode, "WARN");
        log.setErrorMessage(errorMessage);
        apiLogRepository.save(log);
    }

    public void logServerError(String httpMethod, String path, Object requestBody, int statusCode, String errorMessage) {
        ApiLog log = buildLog(httpMethod, path, requestBody, statusCode, "ERROR");
        log.setErrorMessage(errorMessage);
        apiLogRepository.save(log);
    }

    private ApiLog buildLog(String httpMethod, String path, Object requestBody, int statusCode, String logLevel) {
        ApiLog log = new ApiLog();
        log.setTimestamp(Instant.now());
        log.setHttpMethod(httpMethod);
        log.setPath(path);
        log.setRequestBody(requestBody);
        log.setStatusCode(statusCode);
        log.setLogLevel(logLevel);
        return log;
    }
}

