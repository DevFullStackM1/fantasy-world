package com.ynov.fantasy_world.domain.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonPropertyOrder({"id", "nom", "description", "physique", "mental", "perception", "niveau", "classe"})
public class Aventurier {
    private Long id;
    private String nom;
    private String description;
    private Integer physique;
    private Integer mental;
    private Integer perception;
    private Integer niveau;
    private Classe classe;
}

