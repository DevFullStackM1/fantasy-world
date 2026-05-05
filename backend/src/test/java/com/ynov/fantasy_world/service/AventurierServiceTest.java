package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.dto.AventurierUpdateDTO;
import com.ynov.fantasy_world.domain.exception.AventurierNotFoundException;
import com.ynov.fantasy_world.domain.exception.BusinessRuleException;
import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import com.ynov.fantasy_world.infra.dao.repository.AventurierRepository;
import com.ynov.fantasy_world.infra.mapper.AventurierMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AventurierServiceTest {

    @Mock
    private AventurierRepository aventurierRepository;

    @Mock
    private AventurierMapper aventurierMapper;

    private AventurierService aventurierService;

    @BeforeEach
    void setUp() {
        aventurierService = new AventurierService(aventurierRepository, aventurierMapper);
    }

    @Test
    void updateAventurier_shouldFailWhenAventurierNotFound() {
        when(aventurierRepository.findById(42L)).thenReturn(Optional.empty());

        assertThrows(AventurierNotFoundException.class, () -> aventurierService.updateAventurier(42L, new AventurierUpdateDTO()));
    }

    @Test
    void updateAventurier_shouldRejectLevelDecrease() {
        AventurierEntity entity = new AventurierEntity();
        entity.setNiveau(10);
        when(aventurierRepository.findById(1L)).thenReturn(Optional.of(entity));

        AventurierUpdateDTO dto = new AventurierUpdateDTO();
        dto.setNiveau(9);

        assertThrows(BusinessRuleException.class, () -> aventurierService.updateAventurier(1L, dto));
        verify(aventurierMapper, never()).applyUpdate(dto, entity);
        verify(aventurierRepository, never()).save(entity);
    }

    @Test
    void updateAventurier_shouldRejectLevelIncreaseGreaterThanOne() {
        AventurierEntity entity = new AventurierEntity();
        entity.setNiveau(10);
        when(aventurierRepository.findById(1L)).thenReturn(Optional.of(entity));

        AventurierUpdateDTO dto = new AventurierUpdateDTO();
        dto.setNiveau(12);

        assertThrows(BusinessRuleException.class, () -> aventurierService.updateAventurier(1L, dto));
        verify(aventurierMapper, never()).applyUpdate(dto, entity);
        verify(aventurierRepository, never()).save(entity);
    }
}

