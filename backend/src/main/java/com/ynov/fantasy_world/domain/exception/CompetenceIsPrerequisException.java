package com.ynov.fantasy_world.domain.exception;

public class CompetenceIsPrerequisException extends RuntimeException {
    public CompetenceIsPrerequisException(String dependingCompetenceNom) {
        super("Impossible de retirer : cette compétence est un prérequis de « " + dependingCompetenceNom + " » déjà possédée par l'aventurier.");
    }
}
