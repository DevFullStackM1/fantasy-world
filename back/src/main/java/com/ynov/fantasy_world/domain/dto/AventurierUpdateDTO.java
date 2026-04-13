package com.ynov.fantasy_world.domain.dto;

import com.ynov.fantasy_world.domain.model.Classe;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class AventurierUpdateDTO {

    private String nom;

    private String description;

    @Min(value = 0, message = "Le physique doit être entre 0 et 100")
    @Max(value = 100, message = "Le physique doit être entre 0 et 100")
    private Integer physique;

    @Min(value = 0, message = "Le mental doit être entre 0 et 100")
    @Max(value = 100, message = "Le mental doit être entre 0 et 100")
    private Integer mental;

    @Min(value = 0, message = "La perception doit être entre 0 et 100")
    @Max(value = 100, message = "La perception doit être entre 0 et 100")
    private Integer perception;

    @Min(value = 0, message = "Le niveau doit être entre 0 et 100")
    @Max(value = 100, message = "Le niveau doit être entre 0 et 100")
    private Integer niveau;

    private Classe classe;
}

