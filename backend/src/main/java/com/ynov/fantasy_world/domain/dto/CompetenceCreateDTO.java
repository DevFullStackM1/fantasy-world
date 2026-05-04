package com.ynov.fantasy_world.domain.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CompetenceCreateDTO {
    private String nom;
    private String description;
    private String classeRequise;
    private Integer niveauMinimum;
    private String caracteristique;
    private Integer caracteristiqueValeur;
    private List<UUID> competencesRequises;
}
