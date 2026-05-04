package com.ynov.fantasy_world.domain.model;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class Prerequis {
    private String classeRequise;
    private Integer niveauMinimum;
    private String caracteristique;
    private Integer caracteristiqueValeur;
    private List<UUID> competencesRequises;
}
