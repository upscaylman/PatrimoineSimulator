# 📚 Wiki - PatrimoineSimulator

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Installation et configuration](#installation-et-configuration)
4. [Structure du code](#structure-du-code)
5. [Fonctionnalités détaillées](#fonctionnalités-détaillées)
6. [Modèles de calcul](#modèles-de-calcul)
7. [Fiscalité française 2025](#fiscalité-française-2025)
8. [Composants UI](#composants-ui)
9. [Guide d'utilisation](#guide-dutilisation)
10. [Développement](#développement)
11. [Déploiement](#déploiement)
12. [FAQ](#faq)

---

## Vue d'ensemble

**PatrimoineSimulator** est une application web de simulation patrimoniale avancée permettant de modéliser l'évolution d'un patrimoine sur 8 ans en tenant compte de la fiscalité française 2025.

### Objectifs du projet

- **Simulation multi-actifs** : Assurance Vie, SCPI, Immobilier LMNP, Actions (PEA/CTO), PER, PEL
- **Gestion fiscale complète** : Prélèvements sociaux, impôts sur le revenu, flat tax, abattements
- **Scénarios multiples** : Ultra réaliste, Pessimiste, Neutre
- **Crédit Lombard** : Simulation d'effet de levier sur portefeuille d'actions
- **Rente viagère** : Calcul de durée de rente et suivi de consommation
- **Inflation** : Option pour calculer la valeur réelle du patrimoine

### Technologies utilisées

- **Frontend** : React 19.2.0 avec TypeScript
- **Build Tool** : Vite 6.2.0
- **Styling** : Tailwind CSS (via classes utilitaires)
- **Graphiques** : Chart.js 4.5.1
- **Langage** : TypeScript 5.8.2

---

## Architecture du projet

### Structure des dossiers

```
simulateur-patrimonial-expert/
├── components/           # Composants React
│   ├── ui/              # Composants UI réutilisables
│   │   ├── Slider.tsx
│   │   ├── Switch.tsx
│   │   └── TooltipIcon.tsx
│   ├── ChartWrapper.tsx
│   ├── Header.tsx
│   ├── ParamCard.tsx
│   ├── ParamGrid.tsx
│   ├── Recommendations.tsx
│   ├── ResultsSection.tsx
│   ├── ResultsTables.tsx
│   ├── Risks.tsx
│   ├── ScenarioTabs.tsx
│   └── SummaryCard.tsx
├── services/            # Logique métier
│   └── simulationService.ts
├── App.tsx             # Composant principal
├── index.tsx           # Point d'entrée
├── types.ts            # Définitions TypeScript
├── constants.ts        # Constantes et données
├── vite.config.ts      # Configuration Vite
├── tsconfig.json       # Configuration TypeScript
├── package.json        # Dépendances
└── index.html          # Template HTML
```

### Flux de données

```
App.tsx (État global)
    ↓
ParamGrid (Paramètres utilisateur)
    ↓
simulationService.ts (Calculs)
    ↓
ResultsSection (Affichage résultats)
```

### Gestion d'état

L'application utilise un état local React avec `useState` et `useEffect` :

- **État des paramètres** : Un objet `SimulationParams` par scénario
- **État des résultats** : `SimulationResults` calculé de manière décalée (debounce 500ms)
- **Mode sombre** : Persisté dans `localStorage`
- **Scénario actif** : Géré via des onglets

---

## Installation et configuration

### Prérequis

- **Node.js** : Version 18+ recommandée
- **npm** ou **yarn** : Gestionnaire de paquets

### Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/upscaylman/PatrimoineSimulator.git
   cd PatrimoineSimulator
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   - URL locale : `http://localhost:3000`
   - URL réseau : `http://[votre-IP]:3000`

### Configuration

#### Variables d'environnement (optionnel)

Le projet peut utiliser une clé API Gemini (non utilisée actuellement) :

```env
GEMINI_API_KEY=your_api_key_here
```

#### Port du serveur

Le port est configuré dans `vite.config.ts` (par défaut : 3000). Pour le modifier :

```typescript
server: {
  port: 3000,  // Changer ici
  host: '0.0.0.0',
}
```

---

## Structure du code

### Types TypeScript (`types.ts`)

#### `SimulationParams`

Interface principale contenant tous les paramètres de simulation :

```typescript
interface SimulationParams {
  capitalTotal: number; // Capital initial
  inflationActif: boolean; // Activer l'inflation
  inflationTaux: number; // Taux d'inflation annuel (%)

  // Assurance Vie
  avActif: boolean;
  avAlloc: number; // Allocation (%)
  avRendement: number; // Rendement brut annuel (%)
  rente: number; // Rente mensuelle (€)
  avFrais: number; // Frais d'entrée (%)
  avFraisGestion: number; // Frais de gestion annuels (%)

  // SCPI
  scpiActif: boolean;
  scpiAlloc: number;
  scpiProduit: string; // Clé du produit SCPI

  // Immobilier LMNP
  immoActif: boolean;
  immoAlloc: number;
  immoRdt: number; // Rendement locatif brut (%)
  immoPV: number; // Plus-value annuelle (%)
  taxeFonciere: number; // Taxe foncière annuelle (€)
  venteImmo: boolean; // Vendre en année 8

  // Actions
  actionsActif: boolean;
  actionsAlloc: number;
  sp500: number; // % S&P500 (PEA)
  sp500Rdt: number; // Rendement S&P500 (%)
  bitcoinRdt: number; // Rendement Bitcoin (%)

  // Crédit Lombard
  lombardActif: boolean;
  lombardAlloc: number; // % à emprunter sur Actions
  lombardAnnee: number; // Année de contraction (0-8)
  lombardTaux: number; // Taux d'intérêt (%)
  lombardDuree: number; // Durée (3 ou 5 ans)

  // PEL
  pelActif: boolean;
  pelTaux: number; // Taux d'intérêt (%)
  pelInjection: "aucun" | "av" | "lombard"; // Destination finale

  // PER
  perActif: boolean;
  perAlloc: number;
  perRendement: number; // Rendement brut (%)
  perFrais: number; // Frais de gestion (%)
  perTMI: number; // Tranche Marginal d'Impôt (%)
}
```

#### `SimulationResults`

Résultats de la simulation :

```typescript
interface SimulationResults {
  resultatsAnnuels: AnnualResult[]; // Évolution année par année
  detailsFlux: FluxDetail[]; // Détails des flux financiers
  synthese: Synthesis; // Synthèse finale
  params: SimulationParams; // Paramètres utilisés
}
```

### Constantes (`constants.ts`)

#### Fiscalité

```typescript
FISCALITE = {
  flatTax: 0.3, // Flat tax complète (IR + PS)
  flatTaxIR: 0.128, // Part IR de la flat tax
  flatTaxPS: 0.172, // Part PS de la flat tax
  psSeul: 0.172, // Prélèvements sociaux seuls
  lmnpAbattement: 0.5, // Abattement LMNP (50%)
  lmnpIR: 0.3, // Taux IR sur revenus LMNP
  lmnpPS: 0.172, // Taux PS sur revenus LMNP
  pvImmoIR: 0.19, // Taux IR sur plus-value immo
};
```

#### Plafonds légaux

```typescript
PLAFONDS = {
  pea: { limite: 150000 }, // PEA classique
  per: { limite: 33000 }, // PER annuel
  pel: { limite: 61200 }, // PEL
};
```

#### Données SCPI

Les SCPI disponibles avec leurs caractéristiques :

- Sofidynamic (9.52% brut, risque élevé)
- Transitions Europe (8.25% brut, risque modéré-élevé)
- Remake Live (7.50% brut, risque modéré)
- Iroko Zen (7.32% brut, risque modéré)
- Corum Origin (6.05% brut, risque faible-modéré)
- SCPI Euodia (4.50% brut, risque modéré)

### Service de simulation (`services/simulationService.ts`)

Fonction principale : `calculateSimulation(params: SimulationParams)`

#### Algorithme de calcul

1. **Initialisation**

   - Calcul du capital Lombard si activé
   - Initialisation des capitaux par actif
   - Initialisation des variables de suivi

2. **Boucle annuelle (0 à 8 ans)**
   Pour chaque année :

   a. **Assurance Vie**

   - Calcul des intérêts bruts
   - Déduction des frais de gestion
   - Calcul de la rente (si activée)
   - Fiscalité sur la rente (flat tax 30%)

   b. **SCPI**

   - Calcul des dividendes bruts
   - Déduction des frais de gestion
   - Fiscalité (flat tax 30%)

   c. **Immobilier LMNP**

   - Calcul des loyers bruts
   - Abattement 50% (LMNP)
   - Fiscalité (IR 30% + PS 17.2%)
   - Déduction taxe foncière
   - Appréciation de la valeur

   d. **Actions**

   - S&P500 (PEA) : Appréciation
   - Bitcoin (CTO) : Appréciation
   - Fiscalité en fin de période

   e. **Crédit Lombard**

   - Calcul des intérêts
   - Remboursement avec flux disponibles
   - Gestion du capital restant dû

   f. **PEL**

   - Calcul des intérêts
   - Fiscalité (flat tax 30%)
   - Injection optionnelle

   g. **PER**

   - Versement annuel (capital / 8)
   - Calcul des intérêts
   - Déduction des frais
   - Économies d'impôt (TMI)

   h. **Patrimoine global**

   - Somme de tous les actifs
   - Déduction de la dette Lombard

3. **Post-traitement**
   - Calcul des plus-values immobilières (si vente)
   - Abattements progressifs (5-30 ans)
   - Fiscalité sur plus-values actions
   - Calcul du patrimoine net final
   - Ajustement inflation si activé
   - Synthèse finale

#### Fonctions utilitaires

- `calculerAbattementsPV(annees)` : Calcule les abattements sur plus-value immobilière
- `calculerDureeRenteViagere(capital, rente, taux, frais)` : Calcule la durée d'une rente viagère

---

## Fonctionnalités détaillées

### 1. Scénarios multiples

Trois scénarios prédéfinis :

#### Ultra Réaliste

- Données historiques et tendances actuelles
- Aucun override (utilise les paramètres par défaut)

#### Pessimiste

- Marchés difficiles
- Rendements réduits
- Inflation élevée (4%)
- Overrides :
  ```typescript
  {
    avRendement: 1.5,
    immoRdt: 4.0,
    immoPV: -1.0,      // Dépression immobilière
    sp500Rdt: -2.0,    // Baisse des marchés
    bitcoinRdt: 5.0,
    inflationTaux: 4.0
  }
  ```

#### Neutre

- Hypothèses conservatrices
- Rendements modérés
- Overrides :
  ```typescript
  {
    avRendement: 2.5,
    immoRdt: 5.0,
    immoPV: 1.0,
    sp500Rdt: 6.0,
    bitcoinRdt: 15.0,
    inflationTaux: 2.5
  }
  ```

### 2. Crédit Lombard

Le crédit Lombard permet d'emprunter sur un portefeuille d'actions pour augmenter la capacité d'investissement.

#### Conditions

- Nécessite une allocation Actions > 0%
- Montant empruntable : jusqu'à 80% de la valeur du portefeuille Actions

#### Fonctionnement

1. **Contraction** : À l'année choisie (0-8)
2. **Montant** : `capitalInitial × actionsAlloc% × lombardAlloc%`
3. **Remboursement** :
   - Capital : Amortissement linéaire sur la durée
   - Intérêts : Taux annuel sur capital restant dû
   - Source : Loyers immobiliers + Dividendes SCPI
   - Option : Injection PEL pour remboursement

#### Exemple

- Capital initial : 230 000 €
- Allocation Actions : 30% (69 000 €)
- Lombard : 50% de 69 000 € = 34 500 €
- Capital total disponible : 264 500 €

### 3. Rente viagère

La rente viagère permet de retirer un montant mensuel de l'Assurance Vie.

#### Calcul de durée

La durée totale de la rente est calculée selon :

- Capital initial AV
- Rente annuelle (rente × 12)
- Rendement net (rendement - frais gestion)
- Formule : `-ln(1 - (tauxNet × capital) / rente) / ln(1 + tauxNet)`

#### Fonctionnement

- Si `intérêts annuels ≥ rente annuelle` → Rente infinie
- Sinon → Durée limitée calculée
- Suivi de la consommation année par année
- Arrêt automatique si capital épuisé

### 4. Gestion fiscale

#### Assurance Vie

- **Rente** : Flat tax 30% sur la part d'intérêts
- **Sortie** : Pas de fiscalité (hors rente)

#### SCPI

- **Dividendes** : Flat tax 30%
- **Plus-value** : Non calculée (conservation)

#### Immobilier LMNP

- **Loyers** :
  - Abattement 50% (LMNP)
  - IR : 30% sur 50% imposable
  - PS : 17.2% sur 50% imposable
- **Plus-value** (si vente) :
  - Abattements progressifs (5-30 ans)
  - IR : 19% sur plus-value nette
  - PS : 17.2% sur plus-value nette

#### Actions

- **S&P500 (PEA)** :
  - Pas de fiscalité pendant la détention
  - PS : 17.2% sur plus-value en sortie
- **Bitcoin (CTO)** :
  - Flat tax 30% sur plus-value

#### PEL

- **Intérêts** : Flat tax 30%

#### PER

- **Versements** : Déduction IR (TMI)
- **Sortie** : Fiscalité différée (non calculée)

### 5. Allocation dynamique

Le système vérifie que l'allocation totale = 100% :

- **< 100%** : Avertissement jaune
- **= 100%** : Validation verte
- **> 100%** : Erreur rouge

Les sliders d'allocation sont limités pour éviter le dépassement.

### 6. Plafonds légaux

#### PEA

- **Plafond** : 150 000 €
- **Avertissements** :
  - > 90% : Alerte (reste disponible)
  - > 100% : Dépassement (partie en CTO)

#### PER

- **Plafond annuel** : 33 000 €
- **Vérification** : Versement annuel = capital × alloc% / 8
- **Erreur** : Si versement > plafond

### 7. Inflation

Option pour calculer la valeur réelle du patrimoine :

- **Activation** : Switch "Prendre en compte l'inflation"
- **Taux** : Configurable (défaut : 2%)
- **Calcul** : `patrimoineReel = patrimoineNominal / (1 + taux)^8`

---

## Composants UI

### Composants principaux

#### `App.tsx`

Composant racine gérant :

- État global (paramètres, résultats, scénarios)
- Mode sombre
- Calculs décalés (debounce)
- Allocation dynamique

#### `ParamGrid.tsx`

Grille de paramètres avec cartes par actif :

- Capital à Investir
- Assurance Vie
- SCPI
- Immobilier LMNP
- Allocation Actions
- PER
- Crédit Lombard
- PEL

#### `ResultsSection.tsx`

Section d'affichage des résultats :

- Carte de synthèse
- Graphiques (évolution patrimoine)
- Tableaux détaillés
- Recommandations
- Risques

### Composants UI réutilisables

#### `Slider.tsx`

Slider personnalisé avec :

- Valeur affichée
- Min/Max/Step configurables
- Style Tailwind

#### `Switch.tsx`

Toggle switch avec :

- État checked/unchecked
- Désactivation possible
- Style moderne

#### `TooltipIcon.tsx`

Icône d'information avec tooltip au survol

#### `ParamCard.tsx`

Carte de paramètres avec :

- Titre avec icône
- Couleur personnalisable
- Contenu flexible

### Graphiques

Utilisation de Chart.js pour :

- **Évolution du patrimoine** : Ligne temporelle
- **Répartition** : Graphique en secteurs
- **Flux** : Graphique en barres

---

## Guide d'utilisation

### Démarrage rapide

1. **Ouvrir l'application** : `http://localhost:3000`

2. **Choisir un scénario** :

   - Cliquer sur l'onglet (Ultra Réaliste, Pessimiste, Neutre)

3. **Configurer le capital** :

   - Entrer le capital initial
   - Activer l'inflation si souhaité

4. **Allouer les actifs** :

   - Activer les actifs souhaités
   - Ajuster les allocations (total = 100%)
   - Configurer les rendements

5. **Consulter les résultats** :
   - Synthèse en haut
   - Graphiques d'évolution
   - Tableaux détaillés année par année

### Cas d'usage

#### Simulation classique

1. Capital : 230 000 €
2. Allocation :
   - AV : 30%
   - Immobilier : 25%
   - Actions : 30%
   - PER : 5%
   - PEL : 10% (non alloué)
3. Rente : 850 €/mois
4. Scénario : Ultra Réaliste

#### Avec crédit Lombard

1. Activer Actions (30%)
2. Activer Crédit Lombard
3. Configurer :
   - % à emprunter : 50%
   - Année : 0 (immédiat)
   - Taux : 3%
   - Durée : 5 ans
4. Le capital disponible augmente automatiquement

#### Optimisation fiscale

1. Maximiser le PEA (150 000 €)
2. Utiliser le PER pour déduction IR
3. LMNP pour abattement 50%
4. PEA pour actions (pas de fiscalité pendant détention)

---

## Développement

### Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement (port 3000)

# Production
npm run build       # Build de production
npm run preview     # Prévisualisation du build
```

### Structure des commits

Format recommandé :

```
feat: Ajout fonctionnalité X
fix: Correction bug Y
docs: Mise à jour documentation
refactor: Refactoring code
style: Formatage code
```

### Tests (à implémenter)

Structure recommandée :

```
tests/
├── unit/
│   ├── simulationService.test.ts
│   └── utils.test.ts
├── integration/
│   └── App.test.tsx
└── e2e/
    └── simulation.spec.ts
```

### Linting et formatage

Recommandations :

- ESLint pour le linting
- Prettier pour le formatage
- Husky pour les pre-commit hooks

---

## Déploiement

### Build de production

```bash
npm run build
```

Le build génère un dossier `dist/` avec :

- Fichiers HTML/CSS/JS optimisés
- Assets statiques
- Code minifié

### Déploiement sur Vercel

1. **Installer Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Déployer**
   ```bash
   vercel
   ```

### Déploiement sur Netlify

1. **Build command** : `npm run build`
2. **Publish directory** : `dist`
3. **Node version** : 18+

### Variables d'environnement

Pour la production, configurer :

- `GEMINI_API_KEY` (si utilisé)

---

## FAQ

### Questions fréquentes

#### Q: Pourquoi l'allocation doit être exactement 100% ?

**R:** Pour garantir que tout le capital est alloué et éviter les incohérences dans les calculs.

#### Q: Comment fonctionne le crédit Lombard ?

**R:** Il permet d'emprunter sur votre portefeuille d'actions (jusqu'à 80% de sa valeur) pour augmenter votre capacité d'investissement. Le remboursement se fait avec les loyers et dividendes.

#### Q: La rente peut-elle être infinie ?

**R:** Oui, si les intérêts annuels dépassent la rente annuelle, la rente est théoriquement infinie.

#### Q: Pourquoi la fiscalité n'est pas calculée sur le PER en sortie ?

**R:** La fiscalité du PER est différée et dépend de nombreux facteurs (âge, mode de sortie, etc.). Elle n'est pas modélisée dans cette version.

#### Q: Les données SCPI sont-elles à jour ?

**R:** Les données proviennent de sources publiques (2025) mais doivent être vérifiées régulièrement.

#### Q: Peut-on modifier la durée de simulation (8 ans) ?

**R:** Oui, modifier la constante `DUREE` dans `simulationService.ts`.

#### Q: Comment ajouter une nouvelle SCPI ?

**R:** Ajouter une entrée dans `SCPI_DATA` dans `constants.ts` avec les caractéristiques requises.

#### Q: Le mode sombre est-il sauvegardé ?

**R:** Oui, la préférence est sauvegardée dans `localStorage`.

---

## Contribution

### Comment contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- TypeScript strict
- Composants fonctionnels React
- Hooks React (useState, useEffect, useMemo, useCallback)
- Nommage camelCase
- Commentaires pour logique complexe

---

## Licence

Ce projet est privé. Tous droits réservés.

---

## Auteur

**PatrimoineSimulator Team**

- Repository : [https://github.com/upscaylman/PatrimoineSimulator](https://github.com/upscaylman/PatrimoineSimulator)
- Version : 0.0.0

---

## Changelog

### Version 0.0.0 (Initial)

- Simulation patrimoniale multi-actifs
- 3 scénarios (Ultra Réaliste, Pessimiste, Neutre)
- Gestion fiscale française 2025
- Crédit Lombard
- Rente viagère
- Interface React moderne
- Mode sombre
- Graphiques interactifs

---

## Ressources

### Documentation externe

- [Fiscalité française 2025](https://www.impots.gouv.fr)
- [Plafonds PEA/PER/PEL](https://www.service-public.fr)
- [Régime LMNP](https://www.impots.gouv.fr)

### Outils de développement

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

---

_Dernière mise à jour : 2025_
