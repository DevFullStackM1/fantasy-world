package com.ynov.fantasy_world.domain.exception;

public class CompetenceHasAventuriersException extends RuntimeException {
    public CompetenceHasAventuriersException() {
        super("Impossible de supprimer : des aventuriers possèdent encore cette compétence.");
    }
}
