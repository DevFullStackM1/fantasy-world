package com.ynov.fantasy_world.infra.mapper;

import com.ynov.fantasy_world.domain.dto.CompetenceCreateDTO;
import com.ynov.fantasy_world.domain.dto.CompetenceUpdateDTO;
import com.ynov.fantasy_world.domain.model.Competence;
import com.ynov.fantasy_world.domain.model.Prerequis;
import com.ynov.fantasy_world.infra.dao.entity.CompetenceEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class CompetenceMapper {

    public Competence toModel(CompetenceEntity entity) {
        if (entity == null) return null;
        Competence model = new Competence();
        model.setId(entity.getId());
        model.setNom(entity.getNom());
        model.setDescription(entity.getDescription());

        boolean hasPrereq = entity.getClasseRequise() != null
                || entity.getNiveauMinimum() != null
                || entity.getCaracteristique() != null
                || (entity.getCompetencesRequises() != null && !entity.getCompetencesRequises().isEmpty());

        if (hasPrereq) {
            Prerequis prereq = new Prerequis();
            prereq.setClasseRequise(entity.getClasseRequise());
            prereq.setNiveauMinimum(entity.getNiveauMinimum());
            prereq.setCaracteristique(entity.getCaracteristique());
            prereq.setCaracteristiqueValeur(entity.getCaracteristiqueValeur());
            prereq.setCompetencesRequises(entity.getCompetencesRequises());
            model.setPrerequis(prereq);
        }
        return model;
    }

    public CompetenceEntity toEntity(CompetenceCreateDTO dto) {
        CompetenceEntity entity = new CompetenceEntity();
        entity.setNom(dto.getNom());
        entity.setDescription(dto.getDescription());
        entity.setClasseRequise(dto.getClasseRequise());
        entity.setNiveauMinimum(dto.getNiveauMinimum());
        entity.setCaracteristique(dto.getCaracteristique());
        entity.setCaracteristiqueValeur(dto.getCaracteristiqueValeur());
        entity.setCompetencesRequises(
                dto.getCompetencesRequises() != null ? dto.getCompetencesRequises() : new ArrayList<>());
        return entity;
    }

    public void applyUpdate(CompetenceUpdateDTO dto, CompetenceEntity entity) {
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        entity.setClasseRequise(dto.getClasseRequise());
        entity.setNiveauMinimum(dto.getNiveauMinimum());
        entity.setCaracteristique(dto.getCaracteristique());
        entity.setCaracteristiqueValeur(dto.getCaracteristiqueValeur());
        entity.setCompetencesRequises(
                dto.getCompetencesRequises() != null ? dto.getCompetencesRequises() : new ArrayList<>());
    }
}
