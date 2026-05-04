# Frontend — Fantasy World (React + Vite)

Interface web pour la gestion des aventuriers et des compétences.

## Prérequis

- **Node.js 20+** recommandé
- **npm** (ou pnpm / yarn selon votre habitude)

## Lancer le projet

```bash
cd frontend
npm install
npm run dev
```

L’application Vite est servie en général sur **http://localhost:5173**.

## URL de l’API attendue

- **Développement (recommandé)** : laisser `VITE_API_BASE_URL` **vide** (ou non défini). Les requêtes vers `/api` et `/auth` sont **proxifiées** vers `http://localhost:8080` (voir `vite.config.ts`). Le navigateur appelle donc la même origine que le front (`localhost:5173`) et Vite relaie vers le backend.

- **Build / production** : définir **`VITE_API_BASE_URL`** sur l’URL publique du backend **sans** slash final, par exemple `https://api.example.com`. Les chemins OpenAPI (`/api/v1/...`, `/auth/...`) seront préfixés par cette base.

Exemple fichier `.env` en prod :

```env
VITE_API_BASE_URL=https://votre-api.example.com
```

## Génération des types TypeScript depuis OpenAPI

Le contrat canonique est dans **`../documentation/openapi/aventurier.openapi.yml`**.

```bash
cd frontend
npx openapi-typescript ../documentation/openapi/aventurier.openapi.yml -o ./src/api/generated/aventurier.ts
```

## Scripts npm

| Script | Action |
|--------|--------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | ESLint |
