package com.ynov.fantasy_world.domain.model;

import lombok.Data;

import java.util.UUID;

@Data
public class Competence {
    private UUID id;
    private String nom;
    private String description;
    private Prerequis prerequis;
}
