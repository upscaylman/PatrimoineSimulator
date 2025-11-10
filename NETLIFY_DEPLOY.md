# Guide de Déploiement Netlify

## Configuration Netlify

### 1. Connexion du Repository GitHub

1. Allez sur [Netlify Dashboard](https://app.netlify.com/teams/virale-empire/projects)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Sélectionnez **GitHub** et autorisez Netlify à accéder à votre repository
4. Choisissez le repository : `upscaylman/PatrimoineSimulator`
5. Sélectionnez la branche : `main` ou `improve-ui-readability`

### 2. Configuration du Build

Netlify détectera automatiquement les paramètres suivants (définis dans `netlify.toml`) :

- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Node version** : `20`

### 3. Variables d'Environnement (si nécessaire)

Si vous avez des variables d'environnement (comme `GEMINI_API_KEY`), ajoutez-les dans :
- **Site settings** → **Environment variables**

### 4. Déploiement Automatique

Une fois configuré, Netlify déploiera automatiquement :
- À chaque push sur la branche sélectionnée
- À chaque merge de Pull Request

### 5. Domaine Personnalisé (patrimoine.sim)

Pour configurer votre domaine personnalisé :

1. Dans **Site settings** → **Domain management**
2. Cliquez sur **"Add custom domain"**
3. Entrez : `patrimoine.sim`
4. Suivez les instructions pour configurer les DNS :
   - **Type A** : Point vers l'IP de Netlify
   - **Type CNAME** : Point vers votre site Netlify (ex: `your-site.netlify.app`)

### 6. HTTPS

Netlify fournit automatiquement des certificats SSL gratuits via Let's Encrypt pour tous les domaines.

## Avantages de Netlify vs GitHub Pages

✅ **Déploiement plus rapide**  
✅ **CDN global** pour de meilleures performances  
✅ **Prévisualisation des Pull Requests**  
✅ **Formulaires et fonctions serverless** (si besoin)  
✅ **Gestion DNS intégrée**  
✅ **Rollback facile** en cas de problème  

## URLs de votre site

Une fois déployé, votre site sera accessible sur :
- **URL Netlify par défaut** : `https://your-site-name.netlify.app`
- **Domaine personnalisé** : `https://patrimoine.sim` (après configuration DNS)

## Commandes utiles

### Déploiement manuel (via CLI Netlify)

```bash
# Installation de Netlify CLI
npm install -g netlify-cli

# Connexion
netlify login

# Déploiement
netlify deploy --prod
```

### Build local pour tester

```bash
npm run build
npm run preview
```

## Résolution de problèmes

### Erreur de build
- Vérifiez que Node.js 20 est utilisé
- Vérifiez les logs de build dans Netlify Dashboard

### Erreurs 404 sur les routes
- Le fichier `netlify.toml` contient déjà une redirection `/*` → `/index.html` pour gérer le routing React

### Problèmes de domaine personnalisé
- Vérifiez les DNS dans votre registrar
- Attendez la propagation DNS (jusqu'à 24h)
- Vérifiez les paramètres dans Netlify Dashboard

