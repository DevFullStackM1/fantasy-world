package com.ynov.fantasy_world.domain.exception;

import com.ynov.fantasy_world.domain.dto.PrerequisManquantInfo;

import java.util.List;

public class PrerequisNonSatisfaitsException extends RuntimeException {
    private final List<PrerequisManquantInfo> prerequisManquants;

    public PrerequisNonSatisfaitsException(List<PrerequisManquantInfo> prerequisManquants) {
        super("L'aventurier ne remplit pas tous les prérequis de cette compétence.");
        this.prerequisManquants = prerequisManquants;
    }

    public List<PrerequisManquantInfo> getPrerequisManquants() {
        return prerequisManquants;
    }
}
