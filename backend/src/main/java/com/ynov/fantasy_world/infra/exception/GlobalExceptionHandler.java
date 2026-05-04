package com.ynov.fantasy_world.infra.exception;

import com.ynov.fantasy_world.domain.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AventurierNotFoundException.class)
    public ProblemDetail handleNotFound(AventurierNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Aventurier non trouvé");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(CompetenceNotFoundException.class)
    public ProblemDetail handleCompetenceNotFound(CompetenceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Compétence non trouvée");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(PrerequisNonSatisfaitsException.class)
    public ProblemDetail handlePrerequisNonSatisfaits(PrerequisNonSatisfaitsException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        problem.setTitle("Prérequis non satisfaits");
        problem.setType(URI.create("https://api.fantasy-world/errors/prerequis-non-satisfaits"));
        problem.setProperty("prerequisManquants", ex.getPrerequisManquants());
        return problem;
    }

    @ExceptionHandler(CompetenceModificationIncoherenteException.class)
    public ProblemDetail handleModificationIncoherente(CompetenceModificationIncoherenteException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Modification impossible");
        problem.setType(URI.create("https://api.fantasy-world/errors/competence-modification-incoherente"));
        problem.setProperty("aventuriersImpactes", ex.getAventuriersImpactes());
        return problem;
    }

    @ExceptionHandler(CompetenceHasAventuriersException.class)
    public ProblemDetail handleCompetenceHasAventuriers(CompetenceHasAventuriersException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Suppression impossible");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(CompetenceIsPrerequisException.class)
    public ProblemDetail handleCompetenceIsPrerequis(CompetenceIsPrerequisException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Retrait impossible");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ProblemDetail handleBusinessRule(BusinessRuleException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Violation de règle métier");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ProblemDetail handleUserAlreadyExists(UserAlreadyExistsException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Conflit");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(AuthException.class)
    public ProblemDetail handleAuth(AuthException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
        problem.setTitle("Unauthorized");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Erreur de validation");
        problem.setTitle("Requête invalide");
        problem.setType(URI.create("about:blank"));

        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .toList();
        problem.setProperty("errors", errors);

        return problem;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleMessageNotReadable(HttpMessageNotReadableException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Le corps de la requête est invalide ou illisible");
        problem.setTitle("Requête invalide");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Requête invalide");
        problem.setType(URI.create("about:blank"));
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneral(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne du serveur");
        problem.setTitle("Erreur serveur");
        problem.setType(URI.create("about:blank"));
        return problem;
    }
}

