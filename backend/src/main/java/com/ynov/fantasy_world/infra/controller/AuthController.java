package com.ynov.fantasy_world.infra.controller;

import com.ynov.fantasy_world.generated.api.AuthApi;
import com.ynov.fantasy_world.generated.model.AuthResponse;
import com.ynov.fantasy_world.generated.model.LoginRequest;
import com.ynov.fantasy_world.generated.model.RegisterRequest;
import com.ynov.fantasy_world.infra.security.JwtService;
import com.ynov.fantasy_world.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AuthController implements AuthApi {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest.getUsername(), registerRequest.getPassword());

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword())
        );
        var tokenValue = jwtService.generate(auth);
        var response = new AuthResponse();
        response.setAccessToken(tokenValue);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        var tokenValue = jwtService.generate(auth);
        var response = new AuthResponse();
        response.setAccessToken(tokenValue);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> logoutUser() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            authService.logout(jwt.getId(), jwt.getExpiresAt());
        }
        return ResponseEntity.noContent().build();
    }
}

