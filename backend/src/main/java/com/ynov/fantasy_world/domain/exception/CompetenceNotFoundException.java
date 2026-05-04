package com.ynov.fantasy_world.domain.exception;

import java.util.UUID;

public class CompetenceNotFoundException extends RuntimeException {
    public CompetenceNotFoundException(UUID id) {
        super("Compétence introuvable : " + id);
    }
}
