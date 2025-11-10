# 🔍 Analyse des Erreurs - PatrimoineSimulator

## Résumé Exécutif

Cette analyse compare le code React actuel avec le fichier `legacy.html` pour identifier les erreurs et incohérences potentielles dans les calculs de simulation patrimoniale.

---

## 🚨 Erreurs Critiques Identifiées

### 1. ❌ **ERREUR MAJEURE : Application incorrecte des frais AV sur SCPI**

**Fichier** : `services/simulationService.ts` ligne 38

**Code actuel (React)** :

```typescript
let scpiCapital = params.scpiActif
  ? capitalTotal *
    (params.scpiAlloc / 100) *
    (1 - scpiData.fraisEntree / 100) *
    (1 - params.avFrais / 100)
  : 0;
```

**Code legacy** (ligne 1076) :

```javascript
let scpiCapital = params.scpiActif
  ? capitalTotal *
    params.scpiAlloc *
    (1 - scpiData.fraisEntree / 100) *
    (1 - params.avFrais)
  : 0;
```

**Problème** :
Les frais d'entrée de l'Assurance Vie (`avFrais`) sont appliqués au capital SCPI, ce qui est **incorrect**. Les SCPI ont leurs propres frais d'entrée (`scpiData.fraisEntree`) et ne devraient pas être soumis aux frais AV.

**Impact** :

- Sous-estimation du capital SCPI investi
- Calculs de dividendes incorrects
- Patrimoine total sous-évalué

**Correction recommandée** :

```typescript
let scpiCapital = params.scpiActif
  ? capitalTotal * (params.scpiAlloc / 100) * (1 - scpiData.fraisEntree / 100)
  : 0;
```

---

### 2. ⚠️ **INCOHÉRENCE : Calcul des intérêts PER**

**Fichier** : `services/simulationService.ts` lignes 171-178

**Code actuel (React)** :

```typescript
if (params.perActif && annee > 0) {
  const versementPER = (capitalTotal * (params.perAlloc / 100)) / DUREE;
  economiesIRPER += versementPER * (params.perTMI / 100);

  const interetsPERBruts = perSolde * (params.perRendement / 100);
  const fraisGestionPER = perSolde * (params.perFrais / 100);

  perSolde += versementPER + interetsPERBruts - fraisGestionPER;
}
```

**Code legacy** (lignes 1211-1221) :

```javascript
if (params.perActif && annee > 0) {
  const versementPER = (capitalTotal * params.perAlloc) / DUREE;
  const economieIR = versementPER * params.perTMI;
  economiesIRPER += economieIR;

  const interetsPERBruts = perSolde * params.perRendement;
  const fraisGestionPER = perSolde * params.perFrais;
  const interetsPERNets = interetsPERBruts - fraisGestionPER;

  perSolde += versementPER + interetsPERNets;
}
```

**Problème** :
Les deux versions sont mathématiquement équivalentes, mais le code legacy est plus clair en séparant le calcul des intérêts nets. Cependant, il y a une différence dans le format des paramètres :

- **Legacy** : Les paramètres sont déjà en décimales (0.04 pour 4%)
- **React** : Les paramètres sont en pourcentages (4 pour 4%) et divisés par 100

**Impact** :

- Aucun si les paramètres sont correctement formatés
- Risque d'erreur si les paramètres sont mal formatés

**Recommandation** :
Vérifier que les paramètres sont bien en pourcentages dans React (ce qui semble être le cas d'après `constants.ts`).

---

### 3. ⚠️ **INCOHÉRENCE : Calcul des gains S&P500 et Bitcoin dans detailsFlux**

**Fichier** : `services/simulationService.ts` ligne 191

**Code actuel (React)** :

```typescript
detailsFlux.push({
    ...,
    gainsSP500: sp500 * (params.sp500Rdt / 100),
    gainsBitcoin: bitcoin * (params.bitcoinRdt / 100),
    ...
});
```

**Code legacy** (lignes 1255-1256) :

```javascript
gainsSP500: Math.round(rendementSP500),
gainsBitcoin: Math.round(rendementBitcoin),
```

Où `rendementSP500` et `rendementBitcoin` sont calculés AVANT l'ajout au capital :

```javascript
const rendementSP500 = params.actionsActif ? sp500 * params.sp500Rendement : 0;
sp500 += rendementSP500;
const rendementBitcoin = params.actionsActif
  ? bitcoin * params.bitcoinRendement
  : 0;
bitcoin += rendementBitcoin;
```

**Problème** :
Dans React, les gains sont calculés APRÈS l'ajout au capital (ligne 181-182), donc on utilise la valeur déjà augmentée pour calculer les gains de l'année suivante. Cela crée une incohérence.

**Impact** :

- Les gains affichés dans `detailsFlux` sont incorrects (trop élevés)
- Les calculs de fiscalité peuvent être affectés

**Correction recommandée** :

```typescript
// Calculer les gains AVANT de les ajouter au capital
const gainsSP500 = params.actionsActif ? (sp500 * (params.sp500Rdt / 100)) : 0;
const gainsBitcoin = params.actionsActif ? (bitcoin * (params.bitcoinRdt / 100)) : 0;

// Puis ajouter au capital
sp500 += gainsSP500;
bitcoin += gainsBitcoin;

// Utiliser les gains calculés dans detailsFlux
detailsFlux.push({
    ...,
    gainsSP500,
    gainsBitcoin,
    flatTaxBTC: gainsBitcoin * FISCALITE.flatTax,
    ...
});
```

---

### 4. ⚠️ **INCOHÉRENCE : Calcul du capital non alloué**

**Fichier** : `services/simulationService.ts` ligne 217

**Code actuel (React)** :

```typescript
const capitalNonAlloue = params.capitalTotal * (1 - totalAllocPct / 100);
```

**Code legacy** (ligne 1289) :

```javascript
const capitalNonAlloue = params.capitalInitial * (1 - totalAllocPct);
```

**Problème** :

- **React** utilise `capitalTotal` (qui inclut le Lombard) et `totalAllocPct` en pourcentage
- **Legacy** utilise `capitalInitial` (sans Lombard) et `totalAllocPct` en décimales

**Impact** :

- Le capital non alloué est calculé différemment
- Si le Lombard est activé, React inclut le Lombard dans le calcul, ce qui peut être incorrect

**Correction recommandée** :

```typescript
const capitalNonAlloue = capitalInitial * (1 - totalAllocPct / 100);
```

Le capital non alloué devrait être calculé sur le capital initial, pas sur le capital total avec Lombard.

---

## 🔍 Différences de Format (Non-Erreurs)

### 1. Format des paramètres

**Legacy** : Les paramètres sont stockés en décimales (0.04 pour 4%)

- `params.avRendement` = 0.03 pour 3%
- `params.avAlloc` = 0.30 pour 30%

**React** : Les paramètres sont stockés en pourcentages (4 pour 4%)

- `params.avRendement` = 3.0 pour 3%
- `params.avAlloc` = 30 pour 30%

**Impact** : Aucun, tant que les conversions sont cohérentes (ce qui semble être le cas).

---

## ✅ Points de Vérification

### 1. Calcul de la rente viagère

✅ **Correct** : Les deux versions utilisent la même logique

### 2. Calcul du crédit Lombard

✅ **Correct** : Les deux versions utilisent la même logique

### 3. Fiscalité LMNP

✅ **Correct** : Les deux versions utilisent la même logique

### 4. Abattements plus-value immobilière

✅ **Correct** : Les deux versions utilisent la même fonction `calculerAbattementsPV`

---

## 📋 Plan de Correction Recommandé

### Priorité 1 (Critique)

1. ✅ **Corriger le calcul du capital SCPI** : Retirer `(1 - (params.avFrais / 100))`
2. ✅ **Corriger le calcul des gains S&P500/Bitcoin** : Calculer avant l'ajout au capital

### Priorité 2 (Important)

3. ✅ **Corriger le calcul du capital non alloué** : Utiliser `capitalInitial` au lieu de `capitalTotal`

### Priorité 3 (Amélioration)

4. ✅ **Clarifier le calcul PER** : Séparer le calcul des intérêts nets comme dans legacy

---

## 🧪 Tests Recommandés

Après correction, tester avec les scénarios suivants :

1. **Test SCPI seul** :

   - Capital : 100 000 €
   - SCPI : 100%
   - Vérifier que le capital investi = 100 000 × (1 - fraisEntreeSCPI) et NON × (1 - fraisAV)

2. **Test Actions** :

   - Capital : 100 000 €
   - Actions : 100%
   - S&P500 : 50%, Rendement : 10%
   - Vérifier que les gains année 1 = 5 000 € (50 000 × 10%), pas 5 500 €

3. **Test Capital non alloué** :
   - Capital initial : 100 000 €
   - Allocation : 80%
   - Lombard : 20 000 €
   - Vérifier que capital non alloué = 20 000 € (sur capital initial), pas 24 000 €

---

## 📝 Notes Additionnelles

### Format des données dans legacy.html

Dans `legacy.html`, les paramètres sont convertis depuis les inputs HTML :

- Les pourcentages sont divisés par 100 : `parseFloat(value) / 100`
- Les montants sont en euros : `parseFloat(value)`

Dans React, les paramètres sont déjà en pourcentages dans `SimulationParams`, donc la division par 100 est faite dans le service de calcul.

### Cohérence globale

Malgré ces erreurs, la structure globale du code React est cohérente avec le legacy. Les erreurs identifiées sont principalement des bugs de calcul qui peuvent affecter les résultats finaux.

---

_Analyse effectuée le : 2025_
_Fichiers comparés : `legacy.html` vs `services/simulationService.ts`_
