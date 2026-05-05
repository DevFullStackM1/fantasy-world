# Fantasy World

Projet final du module **Développement Full Stack** : monorepo avec documentation contractuelle, API Spring Boot et interface React.

## Groupe

- [Cédric TOE](https://github.com/Cedric-Law)
- [Maxence PERRONIÉ](https://github.com/mxncp85)
- [Clément DROUET](https://github.com/cmtdrt)

## Présentation générale

**Fantasy World** permet de gérer des **aventuriers** et un **référentiel de compétences** avec prérequis (classe, niveau, caractéristiques, autres compétences). L’API applique des règles métier (attribution conditionnelle, retrait, cohérence à la modification). L’authentification repose sur des **JWT** ; les comptes créés via l’inscription ont le rôle **VIEWER** ; un compte **ADMIN** est initialisé pour la démo (`admin` / `admin`).

## Structure du monorepo

| Répertoire | Contenu |
|------------|---------|
| [`documentation/`](documentation/README.md) | Contrat **OpenAPI 3.1** (`openapi/aventurier.openapi.yml`) et documents d’**architecture** / conception. |
| [`backend/`](backend/README.md) | Application **Spring Boot** (fonctionnalités F1 à F10 côté API). |
| [`frontend/`](frontend/README.md) | Application **React** + Vite (F11 à F15, états de chargement / erreur, protection par rôle). |

## Liens vers les README détaillés

- [Backend — lancement, variables d’environnement, OpenAPI](backend/README.md)
- [Frontend — lancement, URL de l’API, génération des types](frontend/README.md)
- [Index de la documentation (architecture + OpenAPI)](documentation/README.md)


Les routes d’authentification sont `/auth/register`, `/auth/login`, `/auth/logout`.

---

## Suivi de projet

### Fonctionnalités attendues

**Gestion des utilisateurs**

- [x] **FU1** : `POST /auth/register` création de compte (rôle VIEWER par défaut)
- [x] **FU2** : `POST /auth/login` authentification et retour du JWT
- [x] **FU3** : `POST /auth/logout` déconnexion (révocation côté serveur + nettoyage côté client)

**Référentiel de compétences**

- [x] **F1** : `GET /competences` liste paginée — **liste complète** exposée (`GET /api/v1/competences`), **sans pagination HTTP** (paramètres `page` / `size` non implémentés)
- [x] **F2** : `GET /competences/{id}` détail avec prérequis (structure résolue : UUID des compétences requises, enums classe / caractéristique)
- [x] **F3** : `POST /competences` création
- [x] **F4** : `PUT /competences/{id}` modification avec vérification de cohérence (Règle 2) — réponse **409** avec `aventuriersImpactes` si incohérence
- [x] **F5** : `DELETE /competences/{id}` suppression si aucun possesseur

**Association compétences / aventuriers**

- [x] **F6** : `GET /aventuriers/{id}/competences` compétences acquises
- [x] **F7** : `POST /aventuriers/{id}/competences/{id}` attribution avec vérification des prérequis (Règle 1) — **422** si prérequis non satisfaits
- [x] **F8** : `DELETE /aventuriers/{id}/competences/{id}` retrait conditionnel (Règle 3)

**Vues enrichies**

- [x] **F9** : `GET /aventuriers/{id}/competences/disponibles` acquérables et bloquées
- [x] **F10** : `GET /competences/{id}/aventuriers` possesseurs et éligibles

**Frontend**

- [x] **F11** : Page liste des compétences
- [x] **F12** : Page détail d'une compétence
- [x] **F13** : Formulaire de création
- [x] **F14** : Formulaire de modification avec gestion du **409** (et messages d’erreur structurés)
- [x] **F15** : Vue enrichie du détail d'un aventurier (acquises / acquérables / bloquées)  
  *États chargement / succès / erreur et routes protégées (`PrivateRoute`, `RequireRole`) sur les interactions concernées.*

### Fonctionnalités bonus

- [ ] **Bonus 1** : `?forcer=true` sur `PUT /competences/{id}`
- [ ] **Bonus 2** : Détection de cycle dans les prérequis
- [ ] **Bonus 3** : Docker Compose (backend + frontend + MongoDB)
