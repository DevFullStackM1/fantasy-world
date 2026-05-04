package com.ynov.fantasy_world.infra.mapper;

import com.ynov.fantasy_world.domain.dto.AventurierCreateDTO;
import com.ynov.fantasy_world.domain.dto.AventurierUpdateDTO;
import com.ynov.fantasy_world.domain.model.Aventurier;
import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import org.springframework.stereotype.Component;

@Component
public class AventurierMapper {

    public AventurierEntity mapToEntity(AventurierCreateDTO dto) {
        AventurierEntity entity = new AventurierEntity();
        entity.setNom(dto.getNom());
        entity.setDescription(dto.getDescription());
        entity.setPhysique(dto.getPhysique());
        entity.setMental(dto.getMental());
        entity.setPerception(dto.getPerception());
        entity.setNiveau(1);
        entity.setClasse(dto.getClasse());
        return entity;
    }

    public void applyUpdate(AventurierUpdateDTO dto, AventurierEntity entity) {
        if (dto.getNom() != null) {
            entity.setNom(dto.getNom());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getPhysique() != null) {
            entity.setPhysique(dto.getPhysique());
        }
        if (dto.getMental() != null) {
            entity.setMental(dto.getMental());
        }
        if (dto.getPerception() != null) {
            entity.setPerception(dto.getPerception());
        }
        if (dto.getNiveau() != null) {
            entity.setNiveau(dto.getNiveau());
        }
        if (dto.getClasse() != null) {
            entity.setClasse(dto.getClasse());
        }
    }

    public Aventurier mapToDto(AventurierEntity entity) {
        Aventurier aventurier = new Aventurier();
        aventurier.setId(entity.getId());
        aventurier.setNom(entity.getNom());
        aventurier.setDescription(entity.getDescription());
        aventurier.setPhysique(entity.getPhysique());
        aventurier.setMental(entity.getMental());
        aventurier.setPerception(entity.getPerception());
        aventurier.setNiveau(entity.getNiveau());
        aventurier.setClasse(entity.getClasse());
        return aventurier;
    }
}

