package com.ynov.fantasy_world.infra.security;

import com.ynov.fantasy_world.infra.dao.repository.RevokedTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtEncoder jwtEncoder(@Value("${app.jwt.secret}") String secretB64) {
        byte[] secret = Base64.getDecoder().decode(secretB64);
        var key = new SecretKeySpec(secret, "HmacSHA256");
        return NimbusJwtEncoder.withSecretKey(key)
                .algorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            @Value("${app.jwt.secret}") String secretB64,
            RevokedTokenRepository revokedTokenRepository
    ) {
        byte[] secret = Base64.getDecoder().decode(secretB64);
        var key = new SecretKeySpec(secret, "HmacSHA256");
        var decoder = NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        var withScope = new JwtClaimValidator<String>("scope", scope -> scope != null && !scope.isBlank());
        var validator = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefault(),
                new JwtTimestampValidator(),
                withScope,
                new RevokedJtiValidator(revokedTokenRepository)
        );
        decoder.setJwtValidator(validator);
        return decoder;
    }
}

