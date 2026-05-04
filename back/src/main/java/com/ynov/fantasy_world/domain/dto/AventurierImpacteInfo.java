package com.ynov.fantasy_world.domain.dto;

import lombok.Data;

import java.util.List;

@Data
public class AventurierImpacteInfo {
    private Long id;
    private String nom;
    private List<String> prerequisManquants;
}
