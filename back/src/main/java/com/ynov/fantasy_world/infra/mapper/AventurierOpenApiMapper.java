package com.ynov.fantasy_world.infra.mapper;

import com.ynov.fantasy_world.domain.dto.AventurierCreateDTO;
import com.ynov.fantasy_world.domain.dto.AventurierUpdateDTO;
import com.ynov.fantasy_world.domain.model.Classe;
import com.ynov.fantasy_world.generated.model.Aventurier;
import com.ynov.fantasy_world.generated.model.AventurierCreate;
import com.ynov.fantasy_world.generated.model.AventurierUpdate;
import org.springframework.stereotype.Component;

@Component
public class AventurierOpenApiMapper {

    public Aventurier toGenerated(com.ynov.fantasy_world.domain.model.Aventurier source) {
        if (source == null) {
            return null;
        }
        Aventurier target = new Aventurier();
        target.setId(source.getId());
        target.setNom(source.getNom());
        target.setDescription(source.getDescription());
        target.setPhysique(source.getPhysique());
        target.setMental(source.getMental());
        target.setPerception(source.getPerception());
        target.setNiveau(source.getNiveau());
        target.setClasse(toGeneratedClasse(source.getClasse()));
        return target;
    }

    public AventurierCreateDTO toCreateDto(AventurierCreate source) {
        AventurierCreateDTO target = new AventurierCreateDTO();
        target.setNom(source.getNom());
        target.setDescription(source.getDescription());
        target.setPhysique(source.getPhysique());
        target.setMental(source.getMental());
        target.setPerception(source.getPerception());
        target.setClasse(toDomainClasse(source.getClasse()));
        return target;
    }

    public AventurierUpdateDTO toUpdateDto(AventurierUpdate source) {
        AventurierUpdateDTO target = new AventurierUpdateDTO();
        target.setNom(source.getNom());
        target.setDescription(source.getDescription());
        target.setPhysique(source.getPhysique());
        target.setMental(source.getMental());
        target.setPerception(source.getPerception());
        target.setNiveau(source.getNiveau());
        target.setClasse(toDomainClasse(source.getClasse()));
        return target;
    }

    private com.ynov.fantasy_world.generated.model.Classe toGeneratedClasse(Classe source) {
        if (source == null) {
            return null;
        }
        return com.ynov.fantasy_world.generated.model.Classe.fromValue(source.getValue());
    }

    private Classe toDomainClasse(com.ynov.fantasy_world.generated.model.Classe source) {
        if (source == null) {
            return null;
        }
        return Classe.fromValue(source.getValue());
    }
}

