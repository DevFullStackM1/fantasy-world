package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.dto.*;
import com.ynov.fantasy_world.domain.exception.*;
import com.ynov.fantasy_world.domain.model.Aventurier;
import com.ynov.fantasy_world.domain.model.Competence;
import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import com.ynov.fantasy_world.infra.dao.entity.CompetenceEntity;
import com.ynov.fantasy_world.infra.dao.repository.AventurierRepository;
import com.ynov.fantasy_world.infra.dao.repository.CompetenceRepository;
import com.ynov.fantasy_world.infra.mapper.AventurierMapper;
import com.ynov.fantasy_world.infra.mapper.CompetenceMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompetenceService {

    private final CompetenceRepository competenceRepository;
    private final AventurierRepository aventurierRepository;
    private final CompetenceMapper competenceMapper;
    private final AventurierMapper aventurierMapper;

    public CompetenceService(
            CompetenceRepository competenceRepository,
            AventurierRepository aventurierRepository,
            CompetenceMapper competenceMapper,
            AventurierMapper aventurierMapper
    ) {
        this.competenceRepository = competenceRepository;
        this.aventurierRepository = aventurierRepository;
        this.competenceMapper = competenceMapper;
        this.aventurierMapper = aventurierMapper;
    }

    // ── F1 – Lister toutes les compétences ──────────────────────────────────

    @Transactional(readOnly = true)
    public List<Competence> getAllCompetences() {
        return competenceRepository.findAll().stream()
                .map(competenceMapper::toModel)
                .toList();
    }

    // ── F2 – Consulter le détail d'une compétence ───────────────────────────

    @Transactional(readOnly = true)
    public Competence getCompetenceById(UUID id) {
        return competenceMapper.toModel(findCompetenceOrThrow(id));
    }

    // ── F3 – Créer une compétence ───────────────────────────────────────────

    public Competence createCompetence(CompetenceCreateDTO dto) {
        validatePrerequisUuids(dto.getCompetencesRequises());
        CompetenceEntity entity = competenceMapper.toEntity(dto);
        return competenceMapper.toModel(competenceRepository.save(entity));
    }

    // ── F4 – Modifier une compétence ────────────────────────────────────────

    public Competence updateCompetence(UUID id, CompetenceUpdateDTO dto) {
        CompetenceEntity entity = findCompetenceOrThrow(id);
        validatePrerequisUuids(dto.getCompetencesRequises());

        // Vérifier cohérence avec les aventuriers qui possèdent déjà cette compétence
        Set<AventurierEntity> aventuriersPossesseurs = entity.getAventuriers();
        if (!aventuriersPossesseurs.isEmpty()) {
            List<AventurierImpacteInfo> impactes = new ArrayList<>();
            for (AventurierEntity av : aventuriersPossesseurs) {
                List<String> missing = computePrerequisManquantsStrings(av, dto);
                if (!missing.isEmpty()) {
                    AventurierImpacteInfo info = new AventurierImpacteInfo();
                    info.setId(av.getId());
                    info.setNom(av.getNom());
                    info.setPrerequisManquants(missing);
                    impactes.add(info);
                }
            }
            if (!impactes.isEmpty()) {
                throw new CompetenceModificationIncoherenteException(impactes);
            }
        }

        competenceMapper.applyUpdate(dto, entity);
        return competenceMapper.toModel(competenceRepository.save(entity));
    }

    // ── F5 – Supprimer une compétence ───────────────────────────────────────

    public void deleteCompetence(UUID id) {
        CompetenceEntity entity = findCompetenceOrThrow(id);
        if (!entity.getAventuriers().isEmpty()) {
            throw new CompetenceHasAventuriersException();
        }
        competenceRepository.delete(entity);
    }

    // ── F6 – Lister les compétences d'un aventurier ─────────────────────────

    @Transactional(readOnly = true)
    public List<Competence> getCompetencesByAventurierId(Long aventurierId) {
        AventurierEntity av = findAventurierOrThrow(aventurierId);
        return av.getCompetences().stream()
                .map(competenceMapper::toModel)
                .toList();
    }

    // ── F7 – Ajouter une compétence à un aventurier ─────────────────────────

    public void addCompetenceToAventurier(Long aventurierId, UUID competenceId) {
        AventurierEntity av = findAventurierOrThrow(aventurierId);
        CompetenceEntity comp = findCompetenceOrThrow(competenceId);

        List<PrerequisManquantInfo> missing = computePrerequisManquants(av, comp);
        if (!missing.isEmpty()) {
            throw new PrerequisNonSatisfaitsException(missing);
        }

        av.getCompetences().add(comp);
        aventurierRepository.save(av);
    }

    // ── F8 – Retirer une compétence d'un aventurier ─────────────────────────

    public void removeCompetenceFromAventurier(Long aventurierId, UUID competenceId) {
        AventurierEntity av = findAventurierOrThrow(aventurierId);
        CompetenceEntity comp = findCompetenceOrThrow(competenceId);

        // Règle 3 : la compétence ne doit pas être prérequis d'une autre possédée
        Set<UUID> avCompIds = av.getCompetences().stream()
                .map(CompetenceEntity::getId)
                .collect(Collectors.toSet());

        for (CompetenceEntity other : av.getCompetences()) {
            if (!other.getId().equals(competenceId)
                    && other.getCompetencesRequises().contains(competenceId)) {
                throw new CompetenceIsPrerequisException(other.getNom());
            }
        }

        av.getCompetences().remove(comp);
        aventurierRepository.save(av);
    }

    // ── F9 – Compétences disponibles et bloquées ────────────────────────────

    @Transactional(readOnly = true)
    public CompetencesDisponiblesDTO getCompetencesDisponibles(Long aventurierId) {
        AventurierEntity av = findAventurierOrThrow(aventurierId);
        Set<UUID> avCompIds = av.getCompetences().stream()
                .map(CompetenceEntity::getId)
                .collect(Collectors.toSet());

        List<Competence> acquerables = new ArrayList<>();
        List<CompetencesBloqueesItemDTO> bloquees = new ArrayList<>();

        for (CompetenceEntity comp : competenceRepository.findAll()) {
            if (avCompIds.contains(comp.getId())) continue; // déjà acquise

            List<String> missing = computePrerequisManquantsStrings(av, comp);
            if (missing.isEmpty()) {
                acquerables.add(competenceMapper.toModel(comp));
            } else {
                CompetencesBloqueesItemDTO item = new CompetencesBloqueesItemDTO();
                item.setCompetence(competenceMapper.toModel(comp));
                item.setPrerequisManquants(missing);
                bloquees.add(item);
            }
        }

        CompetencesDisponiblesDTO dto = new CompetencesDisponiblesDTO();
        dto.setAcquerables(acquerables);
        dto.setBloquees(bloquees);
        return dto;
    }

    // ── F10 – Aventuriers liés à une compétence ─────────────────────────────

    @Transactional(readOnly = true)
    public AventuriersByCompetenceDTO getAventuriersByCompetenceId(UUID competenceId) {
        CompetenceEntity comp = findCompetenceOrThrow(competenceId);

        List<Aventurier> possesseurs = comp.getAventuriers().stream()
                .map(aventurierMapper::mapToDto)
                .toList();

        List<Aventurier> eligibles = new ArrayList<>();
        for (AventurierEntity av : aventurierRepository.findAll()) {
            boolean alreadyHas = av.getCompetences().stream()
                    .anyMatch(c -> c.getId().equals(competenceId));
            if (alreadyHas) continue;

            List<PrerequisManquantInfo> missing = computePrerequisManquants(av, comp);
            if (missing.isEmpty()) {
                eligibles.add(aventurierMapper.mapToDto(av));
            }
        }

        AventuriersByCompetenceDTO dto = new AventuriersByCompetenceDTO();
        dto.setPossesseurs(possesseurs);
        dto.setEligibles(eligibles);
        return dto;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private CompetenceEntity findCompetenceOrThrow(UUID id) {
        return competenceRepository.findById(id)
                .orElseThrow(() -> new CompetenceNotFoundException(id));
    }

    private AventurierEntity findAventurierOrThrow(Long id) {
        return aventurierRepository.findById(id)
                .orElseThrow(() -> new AventurierNotFoundException(id));
    }

    private void validatePrerequisUuids(List<UUID> ids) {
        if (ids == null) return;
        for (UUID reqId : ids) {
            if (!competenceRepository.existsById(reqId)) {
                throw new IllegalArgumentException("Compétence prérequise introuvable : " + reqId);
            }
        }
    }

    /**
     * Calcule les prérequis manquants (structurés) pour F7 / 422.
     */
    private List<PrerequisManquantInfo> computePrerequisManquants(
            AventurierEntity av, CompetenceEntity comp) {

        List<PrerequisManquantInfo> missing = new ArrayList<>();

        if (comp.getNiveauMinimum() != null && av.getNiveau() < comp.getNiveauMinimum()) {
            missing.add(PrerequisManquantInfo.niveau(comp.getNiveauMinimum(), av.getNiveau()));
        }

        if (comp.getCaracteristique() != null && comp.getCaracteristiqueValeur() != null) {
            int actual = getCaracteristiqueValue(av, comp.getCaracteristique());
            if (actual < comp.getCaracteristiqueValeur()) {
                missing.add(PrerequisManquantInfo.caracteristique(
                        comp.getCaracteristique(), comp.getCaracteristiqueValeur(), actual));
            }
        }

        if (comp.getClasseRequise() != null
                && !comp.getClasseRequise().equals(av.getClasse().getValue())) {
            missing.add(PrerequisManquantInfo.classe(
                    comp.getClasseRequise(), av.getClasse().getValue()));
        }

        Set<UUID> avCompIds = av.getCompetences().stream()
                .map(CompetenceEntity::getId)
                .collect(Collectors.toSet());
        for (UUID reqId : comp.getCompetencesRequises()) {
            if (!avCompIds.contains(reqId)) {
                String nomReq = competenceRepository.findById(reqId)
                        .map(CompetenceEntity::getNom)
                        .orElse(reqId.toString());
                missing.add(PrerequisManquantInfo.competence(nomReq));
            }
        }

        return missing;
    }

    /**
     * Variante pour F4 (mise à jour des prérequis d'une compétence) :
     * vérifie si l'aventurier satisferait les NOUVEAUX prérequis.
     */
    private List<String> computePrerequisManquantsStrings(
            AventurierEntity av, CompetenceUpdateDTO dto) {

        List<String> missing = new ArrayList<>();

        if (dto.getNiveauMinimum() != null && av.getNiveau() < dto.getNiveauMinimum()) {
            missing.add("niveau >= " + dto.getNiveauMinimum() + " (actuel : " + av.getNiveau() + ")");
        }

        if (dto.getCaracteristique() != null && dto.getCaracteristiqueValeur() != null) {
            int actual = getCaracteristiqueValue(av, dto.getCaracteristique());
            if (actual < dto.getCaracteristiqueValeur()) {
                missing.add(dto.getCaracteristique() + " >= " + dto.getCaracteristiqueValeur()
                        + " (actuel : " + actual + ")");
            }
        }

        if (dto.getClasseRequise() != null
                && !dto.getClasseRequise().equals(av.getClasse().getValue())) {
            missing.add("classe = " + dto.getClasseRequise()
                    + " (actuelle : " + av.getClasse().getValue() + ")");
        }

        if (dto.getCompetencesRequises() != null) {
            Set<UUID> avCompIds = av.getCompetences().stream()
                    .map(CompetenceEntity::getId)
                    .collect(Collectors.toSet());
            for (UUID reqId : dto.getCompetencesRequises()) {
                if (!avCompIds.contains(reqId)) {
                    String nomReq = competenceRepository.findById(reqId)
                            .map(CompetenceEntity::getNom)
                            .orElse(reqId.toString());
                    missing.add("compétence requise : " + nomReq);
                }
            }
        }

        return missing;
    }

    /**
     * Variante pour F9 : vérifie avec les prérequis actuels de l'entité.
     */
    private List<String> computePrerequisManquantsStrings(
            AventurierEntity av, CompetenceEntity comp) {

        return computePrerequisManquants(av, comp).stream()
                .map(info -> switch (info.getType()) {
                    case "NIVEAU" -> "niveau >= " + info.getRequis() + " (actuel : " + info.getActuel() + ")";
                    case "CARACTERISTIQUE" -> info.getCaracteristique() + " >= " + info.getRequis()
                            + " (actuel : " + info.getActuel() + ")";
                    case "CLASSE" -> "classe = " + info.getRequis() + " (actuelle : " + info.getActuel() + ")";
                    case "COMPETENCE" -> "compétence requise : " + info.getRequis();
                    default -> info.getRequis() + " requis";
                })
                .toList();
    }

    private int getCaracteristiqueValue(AventurierEntity av, String caracteristique) {
        return switch (caracteristique) {
            case "PHYSIQUE" -> av.getPhysique();
            case "MENTAL" -> av.getMental();
            case "PERCEPTION" -> av.getPerception();
            default -> throw new IllegalArgumentException("Caractéristique inconnue : " + caracteristique);
        };
    }
}
