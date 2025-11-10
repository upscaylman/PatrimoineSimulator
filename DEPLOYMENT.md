# Guide de Déploiement GitHub Pages

## Configuration GitHub Pages

### 1. Activer GitHub Pages dans les paramètres du repository

1. Allez sur votre repository GitHub : `https://github.com/upscaylman/PatrimoineSimulator`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **Source**, sélectionnez :
   - **Source** : `GitHub Actions` (recommandé) ou `Deploy from a branch`
   - Si vous choisissez "Deploy from a branch" :
     - **Branch** : `main` ou `master`
     - **Folder** : `/root` ou `/docs` (selon votre configuration)

### 2. Configuration du domaine personnalisé (patrimoine.sim)

Vous avez déjà créé l'enregistrement DNS TXT. Maintenant :

1. Dans les paramètres **Pages** de GitHub :
   - Entrez votre domaine personnalisé : `patrimoine.sim`
   - Cochez **Enforce HTTPS** (recommandé)

2. Attendez la propagation DNS (jusqu'à 24h)

3. Une fois la vérification réussie, GitHub créera automatiquement :
   - Un fichier `CNAME` dans votre repository
   - Les certificats SSL pour HTTPS

### 3. Déploiement automatique

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) se déclenche automatiquement :
- À chaque push sur les branches `main`, `master`, ou `improve-ui-readability`
- Manuellement via l'onglet **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 4. Vérification du déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vérifiez que le workflow "Deploy to GitHub Pages" s'est exécuté avec succès
3. Votre site sera accessible sur :
   - `https://upscaylman.github.io/PatrimoineSimulator/` (URL par défaut)
   - `https://patrimoine.sim` (une fois le domaine configuré)

## Notes importantes

- Le build utilise `GITHUB_PAGES=true` pour configurer correctement le base path
- Les fichiers sont générés dans le dossier `dist/` après le build
- Le workflow utilise GitHub Actions pour un déploiement automatique
- Le domaine personnalisé nécessite une propagation DNS complète (jusqu'à 24h)

## Résolution de problèmes

### Le site ne se charge pas
- Vérifiez que GitHub Pages est activé dans les paramètres
- Vérifiez que le workflow s'est exécuté avec succès
- Attendez quelques minutes après le push

### Erreurs 404
- Vérifiez que le base path dans `vite.config.ts` correspond à votre repository name
- Si votre repo s'appelle `PatrimoineSimulator`, le base path doit être `/PatrimoineSimulator/`

### Problèmes de domaine personnalisé
- Vérifiez que l'enregistrement DNS TXT est correctement configuré
- Attendez la propagation DNS complète (jusqu'à 24h)
- Vérifiez les paramètres DNS de votre domaine

