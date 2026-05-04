package com.ynov.fantasy_world.infra.controller;

import com.ynov.fantasy_world.generated.api.CompetenceApi;
import com.ynov.fantasy_world.generated.model.Competence;
import com.ynov.fantasy_world.generated.model.CompetenceCreate;
import com.ynov.fantasy_world.generated.model.CompetenceUpdate;
import com.ynov.fantasy_world.infra.mapper.CompetenceOpenApiMapper;
import com.ynov.fantasy_world.service.CompetenceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class CompetenceController implements CompetenceApi {

    private final CompetenceService competenceService;
    private final CompetenceOpenApiMapper mapper;

    public CompetenceController(CompetenceService competenceService, CompetenceOpenApiMapper mapper) {
        this.competenceService = competenceService;
        this.mapper = mapper;
    }

    @Override
    public ResponseEntity<List<Competence>> getAllCompetences() {
        var competences = competenceService.getAllCompetences().stream()
                .map(mapper::toGenerated)
                .toList();
        return ResponseEntity.ok(competences);
    }

    @Override
    public ResponseEntity<Competence> getCompetenceById(UUID id) {
        return ResponseEntity.ok(mapper.toGenerated(competenceService.getCompetenceById(id)));
    }

    @Override
    public ResponseEntity<Competence> createCompetence(@Valid CompetenceCreate competenceCreate) {
        var dto = mapper.toCreateDto(competenceCreate);
        var created = competenceService.createCompetence(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toGenerated(created));
    }

    @Override
    public ResponseEntity<Competence> updateCompetence(UUID id, @Valid CompetenceUpdate competenceUpdate) {
        var dto = mapper.toUpdateDto(competenceUpdate);
        var updated = competenceService.updateCompetence(id, dto);
        return ResponseEntity.ok(mapper.toGenerated(updated));
    }

    @Override
    public ResponseEntity<Void> deleteCompetence(UUID id) {
        competenceService.deleteCompetence(id);
        return ResponseEntity.noContent().build();
    }
}
