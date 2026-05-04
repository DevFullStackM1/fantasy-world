package com.ynov.fantasy_world.infra.dao.entity;

import com.ynov.fantasy_world.domain.model.Classe;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "aventurier_competence",
            joinColumns = @JoinColumn(name = "aventurier_id"),
            inverseJoinColumns = @JoinColumn(name = "competence_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<CompetenceEntity> competences = new HashSet<>();
}

