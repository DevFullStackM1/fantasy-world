package com.ynov.fantasy_world.infra.dao.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "api_logs")
public class ApiLog {

    @Id
    private String id;

    private Instant timestamp;

    private String httpMethod;

    private String path;

    private Object requestBody;

    private Object responseBody;

    private int statusCode;

    private String logLevel;

    private String errorMessage;
}

