package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.dto.CompetenceCreateDTO;
import com.ynov.fantasy_world.domain.exception.CompetenceHasAventuriersException;
import com.ynov.fantasy_world.domain.exception.CompetenceIsPrerequisException;
import com.ynov.fantasy_world.domain.exception.PrerequisNonSatisfaitsException;
import com.ynov.fantasy_world.domain.model.Classe;
import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import com.ynov.fantasy_world.infra.dao.entity.CompetenceEntity;
import com.ynov.fantasy_world.infra.dao.repository.AventurierRepository;
import com.ynov.fantasy_world.infra.dao.repository.CompetenceRepository;
import com.ynov.fantasy_world.infra.mapper.AventurierMapper;
import com.ynov.fantasy_world.infra.mapper.CompetenceMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompetenceServiceTest {

    @Mock
    private CompetenceRepository competenceRepository;

    @Mock
    private AventurierRepository aventurierRepository;

    @Mock
    private CompetenceMapper competenceMapper;

    @Mock
    private AventurierMapper aventurierMapper;

    private CompetenceService competenceService;

    @BeforeEach
    void setUp() {
        competenceService = new CompetenceService(
                competenceRepository,
                aventurierRepository,
                competenceMapper,
                aventurierMapper
        );
    }

    @Test
    void createCompetence_shouldFailWhenPrerequisDoesNotExist() {
        UUID missingPrereqId = UUID.randomUUID();
        CompetenceCreateDTO dto = new CompetenceCreateDTO();
        dto.setCompetencesRequises(List.of(missingPrereqId));

        when(competenceRepository.existsById(missingPrereqId)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> competenceService.createCompetence(dto));
        verify(competenceRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void addCompetenceToAventurier_shouldFailWhenLevelPrerequisiteMissing() {
        Long aventurierId = 1L;
        UUID competenceId = UUID.randomUUID();

        AventurierEntity aventurier = new AventurierEntity();
        aventurier.setId(aventurierId);
        aventurier.setNiveau(1);
        aventurier.setClasse(Classe.GUERRIER);

        CompetenceEntity competence = new CompetenceEntity();
        competence.setId(competenceId);
        competence.setNiveauMinimum(5);
        competence.setCompetencesRequises(List.of());

        when(aventurierRepository.findById(aventurierId)).thenReturn(Optional.of(aventurier));
        when(competenceRepository.findById(competenceId)).thenReturn(Optional.of(competence));

        assertThrows(PrerequisNonSatisfaitsException.class,
                () -> competenceService.addCompetenceToAventurier(aventurierId, competenceId));
        verify(aventurierRepository, never()).save(aventurier);
    }

    @Test
    void removeCompetenceFromAventurier_shouldFailWhenUsedAsPrerequisiteByOwnedCompetence() {
        Long aventurierId = 1L;
        UUID prereqId = UUID.randomUUID();
        UUID dependantId = UUID.randomUUID();

        CompetenceEntity prereq = new CompetenceEntity();
        prereq.setId(prereqId);
        prereq.setNom("Escrime");

        CompetenceEntity dependant = new CompetenceEntity();
        dependant.setId(dependantId);
        dependant.setNom("Maître d'armes");
        dependant.setCompetencesRequises(List.of(prereqId));

        AventurierEntity aventurier = new AventurierEntity();
        aventurier.setId(aventurierId);
        aventurier.setCompetences(Set.of(prereq, dependant));

        when(aventurierRepository.findById(aventurierId)).thenReturn(Optional.of(aventurier));
        when(competenceRepository.findById(prereqId)).thenReturn(Optional.of(prereq));

        assertThrows(CompetenceIsPrerequisException.class,
                () -> competenceService.removeCompetenceFromAventurier(aventurierId, prereqId));
        verify(aventurierRepository, never()).save(aventurier);
    }

    @Test
    void deleteCompetence_shouldFailWhenOwnedByAtLeastOneAventurier() {
        UUID competenceId = UUID.randomUUID();

        CompetenceEntity competence = new CompetenceEntity();
        competence.setId(competenceId);
        competence.setAventuriers(Set.of(new AventurierEntity()));

        when(competenceRepository.findById(competenceId)).thenReturn(Optional.of(competence));

        assertThrows(CompetenceHasAventuriersException.class, () -> competenceService.deleteCompetence(competenceId));
        verify(competenceRepository, never()).delete(competence);
    }
}

