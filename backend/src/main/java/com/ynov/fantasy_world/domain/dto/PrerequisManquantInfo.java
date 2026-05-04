package com.ynov.fantasy_world.domain.dto;

import lombok.Data;

@Data
public class PrerequisManquantInfo {
    private String type;         // NIVEAU, CARACTERISTIQUE, CLASSE, COMPETENCE
    private Object requis;
    private Object actuel;
    private String caracteristique; // only for CARACTERISTIQUE type

    public static PrerequisManquantInfo niveau(int requis, int actuel) {
        PrerequisManquantInfo info = new PrerequisManquantInfo();
        info.type = "NIVEAU";
        info.requis = requis;
        info.actuel = actuel;
        return info;
    }

    public static PrerequisManquantInfo caracteristique(String car, int requis, int actuel) {
        PrerequisManquantInfo info = new PrerequisManquantInfo();
        info.type = "CARACTERISTIQUE";
        info.caracteristique = car;
        info.requis = requis;
        info.actuel = actuel;
        return info;
    }

    public static PrerequisManquantInfo classe(String requis, String actuel) {
        PrerequisManquantInfo info = new PrerequisManquantInfo();
        info.type = "CLASSE";
        info.requis = requis;
        info.actuel = actuel;
        return info;
    }

    public static PrerequisManquantInfo competence(String nomRequis) {
        PrerequisManquantInfo info = new PrerequisManquantInfo();
        info.type = "COMPETENCE";
        info.requis = nomRequis;
        info.actuel = "non acquise";
        return info;
    }
}
