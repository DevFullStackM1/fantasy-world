package com.ynov.fantasy_world.domain.dto;

import com.ynov.fantasy_world.domain.model.Aventurier;
import lombok.Data;

import java.util.List;

@Data
public class AventuriersByCompetenceDTO {
    private List<Aventurier> possesseurs;
    private List<Aventurier> eligibles;
}
