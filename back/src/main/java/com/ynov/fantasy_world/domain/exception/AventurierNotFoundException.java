package com.ynov.fantasy_world.domain.exception;

public class AventurierNotFoundException extends RuntimeException {

    public AventurierNotFoundException(Long id) {
        super("Aventurier non trouvé avec l'id: " + id);
    }
}

