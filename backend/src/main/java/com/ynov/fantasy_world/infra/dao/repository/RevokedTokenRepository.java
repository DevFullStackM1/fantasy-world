package com.ynov.fantasy_world.infra.dao.repository;

import com.ynov.fantasy_world.infra.dao.entity.RevokedTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedTokenEntity, Long> {
    boolean existsByJti(String jti);
}

