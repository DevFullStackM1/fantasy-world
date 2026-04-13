package com.ynov.fantasy_world.domain.dto;

import com.ynov.fantasy_world.domain.model.Classe;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AventurierCreateDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "Le physique est obligatoire")
    @Min(value = 0, message = "Le physique doit être entre 0 et 100")
    @Max(value = 100, message = "Le physique doit être entre 0 et 100")
    private Integer physique;

    @NotNull(message = "Le mental est obligatoire")
    @Min(value = 0, message = "Le mental doit être entre 0 et 100")
    @Max(value = 100, message = "Le mental doit être entre 0 et 100")
    private Integer mental;

    @NotNull(message = "La perception est obligatoire")
    @Min(value = 0, message = "La perception doit être entre 0 et 100")
    @Max(value = 100, message = "La perception doit être entre 0 et 100")
    private Integer perception;

    @NotNull(message = "La classe est obligatoire")
    private Classe classe;
}

