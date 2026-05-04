# Backend — Fantasy World (Spring Boot)

API REST sécurisée par JWT (OAuth2 Resource Server), persistance JPA (H2) et journalisation MongoDB.

## Prérequis

- **JDK 25** (voir `pom.xml`)
- **Maven 3.9+** ou utiliser le wrapper `./mvnw` / `mvnw.cmd`

## Lancer le projet

```bash
cd backend
./mvnw spring-boot:run
```

Sous Windows PowerShell :

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

L’application écoute par défaut sur **http://localhost:8080**.

## Génération du code à partir d’OpenAPI

Le contrat est dans **`../documentation/openapi/aventurier.openapi.yml`**.

```bash
cd backend
./mvnw -DskipTests openapi-generator:generate
```

La génération s’exécute aussi automatiquement en phase `generate-sources` lors d’un `compile` / `package`.

## Variables d’environnement (optionnel)

Spring Boot accepte la surcharge par variables d’environnement ou fichier `.env` (via outil externe). Propriétés utiles :

| Propriété / variable | Rôle | Défaut (dev) |
|----------------------|------|----------------|
| `APP_JWT_SECRET` | Secret HS256 **encodé en Base64** pour signer et valider les JWT | Valeur dans `application.yaml` |
| `APP_JWT_ISSUER` | `iss` du JWT | `template-security` |
| `APP_JWT_EXP_MINUTES` | Durée de vie du token en minutes | `60` |
| `SPRING_DATASOURCE_URL` | URL JDBC | H2 en mémoire |
| `SPRING_DATA_MONGODB_URI` | URI MongoDB pour les logs | `mongodb://localhost:27018/fantasy` |
| `SPRING_DATA_MONGODB_DATABASE` | Nom de base | `fantasy-world-logs` |

**Production** : ne jamais committer un secret réel ; fournir `APP_JWT_SECRET` via le gestionnaire de secrets de l’environnement.

## Compte par défaut

Un utilisateur **ADMIN** est initialisé au démarrage : `admin` / `admin` (à désactiver ou changer en production).

## Tests

```bash
./mvnw test
```
