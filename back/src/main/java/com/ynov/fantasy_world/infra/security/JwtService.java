package com.ynov.fantasy_world.infra.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final String issuer;
    private final long expMinutes;

    public JwtService(
            JwtEncoder encoder,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.exp-minutes}") long expMinutes
    ) {
        this.encoder = encoder;
        this.issuer = issuer;
        this.expMinutes = expMinutes;
    }

    public String generate(Authentication auth) {
        Instant now = Instant.now();
        String scope = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(expMinutes, ChronoUnit.MINUTES))
                .subject(auth.getName())
                .id(UUID.randomUUID().toString())
                .claim("scope", scope)
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}

