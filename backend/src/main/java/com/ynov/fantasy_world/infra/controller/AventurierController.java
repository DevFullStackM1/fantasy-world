package com.ynov.fantasy_world.infra.controller;

import com.ynov.fantasy_world.generated.api.AventurierApi;
import com.ynov.fantasy_world.generated.model.*;
import com.ynov.fantasy_world.infra.mapper.AventurierOpenApiMapper;
import com.ynov.fantasy_world.infra.mapper.CompetenceOpenApiMapper;
import com.ynov.fantasy_world.service.AventurierService;
import com.ynov.fantasy_world.service.CompetenceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
public class AventurierController implements AventurierApi {

    private final AventurierService aventurierService;
    private final AventurierOpenApiMapper openApiMapper;
    private final CompetenceService competenceService;
    private final CompetenceOpenApiMapper competenceMapper;

    public AventurierController(
            AventurierService aventurierService,
            AventurierOpenApiMapper openApiMapper,
            CompetenceService competenceService,
            CompetenceOpenApiMapper competenceMapper
    ) {
        this.aventurierService = aventurierService;
        this.openApiMapper = openApiMapper;
        this.competenceService = competenceService;
        this.competenceMapper = competenceMapper;
    }

    @Override
    public ResponseEntity<List<Aventurier>> getAllAventuriers() {
        var aventuriers = aventurierService.getAllAventuriers().stream()
                .map(openApiMapper::toGenerated)
                .toList();
        return ResponseEntity.ok(aventuriers);
    }

    @Override
    public ResponseEntity<Aventurier> getAventurierById(@NotNull Long id) {
        var aventurier = aventurierService.getAventurierById(id);
        return ResponseEntity.ok(openApiMapper.toGenerated(aventurier));
    }

    @Override
    public ResponseEntity<AventuriersByCompetence> getAventuriersByCompetenceId(UUID id) {
        var result = competenceService.getAventuriersByCompetenceId(id);
        return ResponseEntity.ok(competenceMapper.toGeneratedByCompetence(result));
    }

    @Override
    public ResponseEntity<List<Competence>> getCompetencesByAventurierId(Long id) {
        var competences = competenceService.getCompetencesByAventurierId(id).stream()
                .map(competenceMapper::toGenerated)
                .toList();
        return ResponseEntity.ok(competences);
    }

    @Override
    public ResponseEntity<CompetencesDisponibles> getCompetencesDisponiblesByAventurierId(Long id) {
        var result = competenceService.getCompetencesDisponibles(id);
        return ResponseEntity.ok(competenceMapper.toGeneratedDisponibles(result));
    }

    @Override
    public ResponseEntity<Void> removeCompetenceFromAventurier(Long id, UUID cId) {
        competenceService.removeCompetenceFromAventurier(id, cId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> addCompetenceToAventurier(Long id, UUID cId) {
        competenceService.addCompetenceToAventurier(id, cId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Aventurier> createAventurier(@Valid AventurierCreate aventurierCreate) {
        var createDto = openApiMapper.toCreateDto(aventurierCreate);
        var created = aventurierService.createAventurier(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(openApiMapper.toGenerated(created));
    }

    @Override
    public ResponseEntity<Aventurier> updateAventurier(@NotNull Long id, @Valid AventurierUpdate aventurierUpdate) {
        var updateDto = openApiMapper.toUpdateDto(aventurierUpdate);
        var updated = aventurierService.updateAventurier(id, updateDto);
        return ResponseEntity.ok(openApiMapper.toGenerated(updated));
    }

    @Override
    public ResponseEntity<Void> deleteAventurier(@NotNull Long id) {
        aventurierService.deleteAventurier(id);
        return ResponseEntity.noContent().build();
    }
}

