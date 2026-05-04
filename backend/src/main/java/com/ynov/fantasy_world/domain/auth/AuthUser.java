package com.ynov.fantasy_world.domain.auth;

public record AuthUser(String username, String password, Role role) {
}

