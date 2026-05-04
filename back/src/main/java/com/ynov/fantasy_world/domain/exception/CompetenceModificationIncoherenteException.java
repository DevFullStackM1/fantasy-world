package com.ynov.fantasy_world.domain.exception;

import com.ynov.fantasy_world.domain.dto.AventurierImpacteInfo;

import java.util.List;

public class CompetenceModificationIncoherenteException extends RuntimeException {
    private final List<AventurierImpacteInfo> aventuriersImpactes;

    public CompetenceModificationIncoherenteException(List<AventurierImpacteInfo> aventuriersImpactes) {
        super("Les nouveaux prérequis rendraient " + aventuriersImpactes.size() + " aventurier(s) incohérent(s).");
        this.aventuriersImpactes = aventuriersImpactes;
    }

    public List<AventurierImpacteInfo> getAventuriersImpactes() {
        return aventuriersImpactes;
    }
}
