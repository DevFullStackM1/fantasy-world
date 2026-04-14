package com.ynov.fantasy_world.infra.controller;

import com.ynov.fantasy_world.generated.api.AventurierApi;
import com.ynov.fantasy_world.generated.model.*;
import com.ynov.fantasy_world.infra.mapper.AventurierOpenApiMapper;
import com.ynov.fantasy_world.service.AventurierService;
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

    public AventurierController(
            AventurierService aventurierService,
            AventurierOpenApiMapper openApiMapper
    ) {
        this.aventurierService = aventurierService;
        this.openApiMapper = openApiMapper;
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
    public ResponseEntity<List<AventurierRef>> getAventuriersByCompetenceId(UUID id) {
        return null;
    }

    @Override
    public ResponseEntity<List<Competence>> getCompetencesByAventurierId(Long id) {
        return null;
    }

    @Override
    public ResponseEntity<List<Competence>> getCompetencesDisponiblesByAventurierId(Long id) {
        return null;
    }

    @Override
    public ResponseEntity<Void> removeCompetenceFromAventurier(Long id, UUID cId) {
        return null;
    }

    @Override
    public ResponseEntity<Void> addCompetenceToAventurier(Long id, UUID cId) {
        return null;
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

