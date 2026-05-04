package com.ynov.fantasy_world.domain.dto;

import com.ynov.fantasy_world.domain.model.Competence;
import lombok.Data;

import java.util.List;

@Data
public class CompetencesBloqueesItemDTO {
    private Competence competence;
    private List<String> prerequisManquants;
}
