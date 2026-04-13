package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.auth.Role;
import com.ynov.fantasy_world.domain.exception.AuthException;
import com.ynov.fantasy_world.domain.exception.UserAlreadyExistsException;
import com.ynov.fantasy_world.infra.dao.entity.RevokedTokenEntity;
import com.ynov.fantasy_world.infra.dao.entity.UserEntity;
import com.ynov.fantasy_world.infra.dao.repository.RevokedTokenRepository;
import com.ynov.fantasy_world.infra.dao.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            RevokedTokenRepository revokedTokenRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.revokedTokenRepository = revokedTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(String username, String password) {
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("username et password sont obligatoires");
        }
        var normalizedUsername = username.trim();

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new UserAlreadyExistsException("L'utilisateur existe déjà");
        }

        var user = new UserEntity();
        user.setUsername(normalizedUsername);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(Role.VIEWER);
        userRepository.save(user);
    }

    public void logout(String jti, Instant expiresAt) {
        if (jti == null || jti.isBlank()) {
            throw new AuthException("Token invalide");
        }
        if (expiresAt == null) {
            throw new AuthException("Token invalide");
        }
        if (revokedTokenRepository.existsByJti(jti)) {
            return;
        }
        var revoked = new RevokedTokenEntity();
        revoked.setJti(jti);
        revoked.setExpiresAt(expiresAt);
        revokedTokenRepository.save(revoked);
    }
}

