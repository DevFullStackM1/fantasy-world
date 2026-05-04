package com.ynov.fantasy_world.domain.dto;

import com.ynov.fantasy_world.domain.model.Competence;
import lombok.Data;

import java.util.List;

@Data
public class CompetencesDisponiblesDTO {
    private List<Competence> acquerables;
    private List<CompetencesBloqueesItemDTO> bloquees;
}
