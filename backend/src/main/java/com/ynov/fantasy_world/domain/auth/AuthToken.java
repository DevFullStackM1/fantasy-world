package com.ynov.fantasy_world.domain.auth;

import java.time.Instant;

public record AuthToken(String token, String username, Role role, Instant expiresAt) {
}

