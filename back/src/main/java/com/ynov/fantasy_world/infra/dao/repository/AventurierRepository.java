package com.ynov.fantasy_world.infra.dao.repository;

import com.ynov.fantasy_world.infra.dao.entity.AventurierEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AventurierRepository extends JpaRepository<AventurierEntity, Long> {
}

