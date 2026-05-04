package com.ynov.fantasy_world.infra.dao.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "competence")
public class CompetenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Prerequis – champs inlinés
    private String classeRequise;
    private Integer niveauMinimum;
    private String caracteristique; // PHYSIQUE | MENTAL | PERCEPTION
    private Integer caracteristiqueValeur;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "competence_prerequis_requises",
            joinColumns = @JoinColumn(name = "competence_id")
    )
    @Column(name = "competence_requise_id")
    private List<UUID> competencesRequises = new ArrayList<>();

    @ManyToMany(mappedBy = "competences", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<AventurierEntity> aventuriers = new HashSet<>();
}
