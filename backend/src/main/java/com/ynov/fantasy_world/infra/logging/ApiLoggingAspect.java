package com.ynov.fantasy_world.infra.logging;

import com.ynov.fantasy_world.domain.exception.AventurierNotFoundException;
import com.ynov.fantasy_world.domain.exception.BusinessRuleException;
import com.ynov.fantasy_world.infra.service.ApiLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.annotation.Annotation;

@Aspect
@Component
@Slf4j
public class ApiLoggingAspect {

    private final ApiLogService apiLogService;

    public ApiLoggingAspect(ApiLogService apiLogService) {
        this.apiLogService = apiLogService;
    }

    /*@Around("execution(* com.ynov.fantasy_world.infra.controller..*(..))")
    public Object logApiCall(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getCurrentRequest();
        String httpMethod = request.getMethod();
        String path = request.getRequestURI();
        Object requestBody = extractRequestBody(joinPoint);

        try {
            Object result = joinPoint.proceed();

            int statusCode = 200;
            Object responseBody = null;

            if (result instanceof ResponseEntity<?> responseEntity) {
                statusCode = responseEntity.getStatusCode().value();
                responseBody = responseEntity.getBody();
            }

            if (responseBody != null) {
                log.info("{} {} → {} | réponse: {}", httpMethod, path, statusCode, responseBody);
            } else {
                log.info("{} {} → {} | succès", httpMethod, path, statusCode);
            }

            apiLogService.logSuccess(httpMethod, path, requestBody, responseBody, statusCode);
            return result;

        } catch (Exception ex) {
            int statusCode = resolveErrorStatusCode(ex);
            String errorMessage = ex.getMessage();

            if (statusCode >= 500) {
                log.error("{} {} → {} | erreur: {}", httpMethod, path, statusCode, errorMessage);
                apiLogService.logServerError(httpMethod, path, requestBody, statusCode, errorMessage);
            } else {
                log.warn("{} {} → {} | erreur client: {}", httpMethod, path, statusCode, errorMessage);
                apiLogService.logClientError(httpMethod, path, requestBody, statusCode, errorMessage);
            }

            throw ex;
        }
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs.getRequest();
    }

    private Object extractRequestBody(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Annotation[][] paramAnnotations = signature.getMethod().getParameterAnnotations();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < paramAnnotations.length; i++) {
            for (Annotation annotation : paramAnnotations[i]) {
                if (annotation instanceof RequestBody) {
                    return args[i];
                }
            }
        }
        return null;
    }

    private int resolveErrorStatusCode(Exception ex) {
        if (ex instanceof AventurierNotFoundException) return 404;
        if (ex instanceof BusinessRuleException) return 409;
        if (ex instanceof MethodArgumentNotValidException) return 400;
        if (ex instanceof HttpMessageNotReadableException) return 400;
        if (ex instanceof IllegalArgumentException) return 400;
        return 500;
    }*/
}

