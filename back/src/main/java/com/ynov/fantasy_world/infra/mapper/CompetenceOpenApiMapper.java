package com.ynov.fantasy_world.infra.mapper;

import com.ynov.fantasy_world.domain.dto.AventuriersByCompetenceDTO;
import com.ynov.fantasy_world.domain.dto.CompetenceCreateDTO;
import com.ynov.fantasy_world.domain.dto.CompetencesDisponiblesDTO;
import com.ynov.fantasy_world.domain.dto.CompetenceUpdateDTO;
import com.ynov.fantasy_world.domain.model.Competence;
import com.ynov.fantasy_world.domain.model.Prerequis;
import com.ynov.fantasy_world.generated.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class CompetenceOpenApiMapper {

    private final AventurierOpenApiMapper aventurierMapper;

    public CompetenceOpenApiMapper(AventurierOpenApiMapper aventurierMapper) {
        this.aventurierMapper = aventurierMapper;
    }

    // ── Domain → Generated ───────────────────────────────────────────────────

    public com.ynov.fantasy_world.generated.model.Competence toGenerated(Competence source) {
        if (source == null) return null;

        com.ynov.fantasy_world.generated.model.Competence target =
                new com.ynov.fantasy_world.generated.model.Competence();
        target.setId(source.getId() != null ? UUID.fromString(source.getId().toString()) : null);
        target.setNom(source.getNom());
        target.setDescription(source.getDescription());

        Prerequis prereq = source.getPrerequis();
        if (prereq != null) {
            PrerequisCompetence pc = new PrerequisCompetence();
            if (prereq.getClasseRequise() != null) {
                try {
                    pc.setClasseRequise(com.ynov.fantasy_world.generated.model.Classe
                            .fromValue(prereq.getClasseRequise()));
                } catch (IllegalArgumentException ignored) {
                }
            }
            pc.setNiveauMinimum(prereq.getNiveauMinimum());
            if (prereq.getCaracteristique() != null && prereq.getCaracteristiqueValeur() != null) {
                CaracteristiqueMin cm = new CaracteristiqueMin();
                try {
                    cm.setCaracteristique(Caracteristique.fromValue(prereq.getCaracteristique()));
                } catch (IllegalArgumentException ignored) {
                }
                cm.setValeur(prereq.getCaracteristiqueValeur());
                pc.setCaracteristiquesMin(cm);
            }
            if (prereq.getCompetencesRequises() != null) {
                pc.setCompetencesRequises(List.copyOf(prereq.getCompetencesRequises()));
            }
            target.setPrerequis(pc);
        }

        return target;
    }

    public CompetencesDisponibles toGeneratedDisponibles(CompetencesDisponiblesDTO source) {
        CompetencesDisponibles target = new CompetencesDisponibles();
        target.setAcquerables(source.getAcquerables().stream().map(this::toGenerated).toList());
        target.setBloquees(source.getBloquees().stream().map(item -> {
            CompetencesBloqueesItem gi = new CompetencesBloqueesItem();
            gi.setCompetence(toGenerated(item.getCompetence()));
            gi.setPrerequisManquants(item.getPrerequisManquants());
            return gi;
        }).toList());
        return target;
    }

    public AventuriersByCompetence toGeneratedByCompetence(AventuriersByCompetenceDTO source) {
        AventuriersByCompetence target = new AventuriersByCompetence();
        target.setPossesseurs(source.getPossesseurs().stream()
                .map(aventurierMapper::toGenerated).toList());
        target.setEligibles(source.getEligibles().stream()
                .map(aventurierMapper::toGenerated).toList());
        return target;
    }

    // ── Generated → DTO ─────────────────────────────────────────────────────

    public CompetenceCreateDTO toCreateDto(
            com.ynov.fantasy_world.generated.model.CompetenceCreate source) {
        CompetenceCreateDTO dto = new CompetenceCreateDTO();
        dto.setNom(source.getNom());
        dto.setDescription(source.getDescription());
        fillPrerequisFromGenerated(source.getPrerequis(), dto);
        return dto;
    }

    public CompetenceUpdateDTO toUpdateDto(
            com.ynov.fantasy_world.generated.model.CompetenceUpdate source) {
        CompetenceUpdateDTO dto = new CompetenceUpdateDTO();
        dto.setNom(source.getNom());
        dto.setDescription(source.getDescription());
        fillPrerequisFromGenerated(source.getPrerequis(), dto);
        return dto;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private void fillPrerequisFromGenerated(PrerequisCompetence pc, CompetenceCreateDTO dto) {
        if (pc == null) return;
        if (pc.getClasseRequise() != null) dto.setClasseRequise(pc.getClasseRequise().getValue());
        dto.setNiveauMinimum(pc.getNiveauMinimum());
        if (pc.getCaracteristiquesMin() != null) {
            CaracteristiqueMin cm = pc.getCaracteristiquesMin();
            if (cm.getCaracteristique() != null) {
                dto.setCaracteristique(cm.getCaracteristique().getValue());
            }
            dto.setCaracteristiqueValeur(cm.getValeur());
        }
        if (pc.getCompetencesRequises() != null) {
            dto.setCompetencesRequises(List.copyOf(pc.getCompetencesRequises()));
        }
    }

    private void fillPrerequisFromGenerated(PrerequisCompetence pc, CompetenceUpdateDTO dto) {
        if (pc == null) return;
        if (pc.getClasseRequise() != null) dto.setClasseRequise(pc.getClasseRequise().getValue());
        dto.setNiveauMinimum(pc.getNiveauMinimum());
        if (pc.getCaracteristiquesMin() != null) {
            CaracteristiqueMin cm = pc.getCaracteristiquesMin();
            if (cm.getCaracteristique() != null) {
                dto.setCaracteristique(cm.getCaracteristique().getValue());
            }
            dto.setCaracteristiqueValeur(cm.getValeur());
        }
        if (pc.getCompetencesRequises() != null) {
            dto.setCompetencesRequises(List.copyOf(pc.getCompetencesRequises()));
        }
    }
}
