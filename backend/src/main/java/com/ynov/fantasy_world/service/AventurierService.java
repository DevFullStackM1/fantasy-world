package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.dto.AventurierCreateDTO;
import com.ynov.fantasy_world.domain.dto.AventurierUpdateDTO;
import com.ynov.fantasy_world.domain.exception.AventurierNotFoundException;
import com.ynov.fantasy_world.domain.exception.BusinessRuleException;
import com.ynov.fantasy_world.domain.model.Aventurier;
import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import com.ynov.fantasy_world.infra.dao.repository.AventurierRepository;
import com.ynov.fantasy_world.infra.mapper.AventurierMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AventurierService {

    private final AventurierRepository aventurierRepository;
    private final AventurierMapper aventurierMapper;

    public AventurierService(AventurierRepository aventurierRepository, AventurierMapper aventurierMapper) {
        this.aventurierRepository = aventurierRepository;
        this.aventurierMapper = aventurierMapper;
    }

    public List<Aventurier> getAllAventuriers() {
        return aventurierRepository.findAll().stream()
                .map(aventurierMapper::mapToDto)
                .toList();
    }

    public Aventurier getAventurierById(Long id) {
        AventurierEntity entity = aventurierRepository.findById(id)
                .orElseThrow(() -> new AventurierNotFoundException(id));
        return aventurierMapper.mapToDto(entity);
    }

    public Aventurier createAventurier(AventurierCreateDTO dto) {
        AventurierEntity entity = aventurierMapper.mapToEntity(dto);
        AventurierEntity saved = aventurierRepository.save(entity);
        return aventurierMapper.mapToDto(saved);
    }

    public Aventurier updateAventurier(Long id, AventurierUpdateDTO dto) {
        AventurierEntity entity = aventurierRepository.findById(id)
                .orElseThrow(() -> new AventurierNotFoundException(id));

        if (dto.getNiveau() != null) {
            validateNiveauUpdate(entity.getNiveau(), dto.getNiveau());
        }

        aventurierMapper.applyUpdate(dto, entity);

        AventurierEntity saved = aventurierRepository.save(entity);
        return aventurierMapper.mapToDto(saved);
    }

    public void deleteAventurier(Long id) {
        aventurierRepository.deleteById(id);
    }

    private void validateNiveauUpdate(int currentNiveau, int newNiveau) {
        if (newNiveau < currentNiveau) {
            throw new BusinessRuleException(
                    "Le niveau ne peut jamais descendre. Niveau actuel: " + currentNiveau + ", niveau demandé: " + newNiveau);
        }
        if (newNiveau > currentNiveau + 1) {
            throw new BusinessRuleException(
                    "Le niveau ne peut pas monter de plus de 1 à la fois. Niveau actuel: " + currentNiveau + ", niveau demandé: " + newNiveau);
        }
    }
}

