package com.ynov.fantasy_world.infra.dao.repository;

import com.ynov.fantasy_world.infra.dao.entity.CompetenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CompetenceRepository extends JpaRepository<CompetenceEntity, UUID> {

    boolean existsByNom(String nom);

    @Query("SELECT c FROM CompetenceEntity c JOIN c.competencesRequises r WHERE r = :reqId")
    List<CompetenceEntity> findByCompetenceRequise(@Param("reqId") UUID reqId);
}
