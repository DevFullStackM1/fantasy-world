package com.ynov.fantasy_world.infra.security;

import com.ynov.fantasy_world.infra.dao.repository.RevokedTokenRepository;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class RevokedJtiValidator implements OAuth2TokenValidator<Jwt> {

    private final RevokedTokenRepository revokedTokenRepository;

    public RevokedJtiValidator(RevokedTokenRepository revokedTokenRepository) {
        this.revokedTokenRepository = revokedTokenRepository;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        var jti = token.getId();
        if (jti != null && revokedTokenRepository.existsByJti(jti)) {
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Token révoqué", null));
        }
        return OAuth2TokenValidatorResult.success();
    }
}

