package com.ynov.fantasy_world.domain.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Classe {
    MAGE("MAGE"),
    GUERRIER("GUERRIER"),
    ARCHER("ARCHER"),
    RODEUR("RÔDEUR"),
    PRETRE("PRÊTRE"),
    CHANTEUR("CHANTEUR"),
    NEGATEUR("NÉGATEUR"),
    SORCIER("SORCIER"),
    PALADIN("PALADIN"),
    BARD("BARD");

    private final String value;

    Classe(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Classe fromValue(String value) {
        for (Classe c : values()) {
            if (c.value.equalsIgnoreCase(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Classe inconnue: " + value);
    }
}

