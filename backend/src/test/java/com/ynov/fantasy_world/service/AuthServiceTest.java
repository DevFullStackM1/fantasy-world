package com.ynov.fantasy_world.service;

import com.ynov.fantasy_world.domain.auth.Role;
import com.ynov.fantasy_world.domain.exception.AuthException;
import com.ynov.fantasy_world.domain.exception.UserAlreadyExistsException;
import com.ynov.fantasy_world.infra.dao.entity.RevokedTokenEntity;
import com.ynov.fantasy_world.infra.dao.entity.UserEntity;
import com.ynov.fantasy_world.infra.dao.repository.RevokedTokenRepository;
import com.ynov.fantasy_world.infra.dao.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RevokedTokenRepository revokedTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, revokedTokenRepository, passwordEncoder);
    }

    @Test
    void register_shouldCreateViewerUser_withTrimmedUsername() {
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("hashed-secret");

        authService.register("  alice  ", "secret");

        ArgumentCaptor<UserEntity> captor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(captor.capture());
        UserEntity saved = captor.getValue();

        assertEquals("alice", saved.getUsername());
        assertEquals("hashed-secret", saved.getPasswordHash());
        assertEquals(Role.VIEWER, saved.getRole());
    }

    @Test
    void register_shouldFailWhenUserAlreadyExists() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.register("alice", "secret"));

        verify(userRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void logout_shouldRejectBlankJti() {
        assertThrows(AuthException.class, () -> authService.logout(" ", Instant.now()));
    }

    @Test
    void logout_shouldSaveRevokedToken_whenNotAlreadyRevoked() {
        Instant expiry = Instant.now().plusSeconds(600);
        when(revokedTokenRepository.existsByJti("jti-1")).thenReturn(false);

        authService.logout("jti-1", expiry);

        ArgumentCaptor<RevokedTokenEntity> captor = ArgumentCaptor.forClass(RevokedTokenEntity.class);
        verify(revokedTokenRepository).save(captor.capture());
        assertEquals("jti-1", captor.getValue().getJti());
        assertEquals(expiry, captor.getValue().getExpiresAt());
    }
}

