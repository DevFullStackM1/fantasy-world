package com.ynov.fantasy_world.infra.dao.entity;

import com.ynov.fantasy_world.domain.model.Classe;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "aventurier")
public class AventurierEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    private Integer physique;

    private Integer mental;

    private Integer perception;

    private Integer niveau;

    @Enumerated(EnumType.STRING)
    private Classe classe;
}

