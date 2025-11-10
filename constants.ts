
import type { SimulationParams } from './types';

export const FISCALITE = { flatTax: 0.30, flatTaxIR: 0.128, flatTaxPS: 0.172, psSeul: 0.172, lmnpAbattement: 0.50, lmnpIR: 0.30, lmnpPS: 0.172, pvImmoIR: 0.19 };

export const SCPI_DATA: { [key: string]: any } = {
    sofidynamic: { nom: "Sofidynamic", tauxBrut: 9.52, fraisEntree: 0, fraisGestion: 10.8, tof: 94.7, capitalisation: "85 M€", zone: "Europe", risque: "Élevé", source: "placement.meilleurtaux.com", sourceUrl: "https://placement.meilleurtaux.com/scpi/meilleures-scpi/" },
    transitions: { nom: "Transitions Europe", tauxBrut: 8.25, fraisEntree: 8.5, fraisGestion: 9.5, tof: 95.5, capitalisation: "450 M€", zone: "Europe", risque: "Modéré-élevé", source: "centraledesscpi.com", sourceUrl: "https://www.centraledesscpi.com/decouvrir-les-scpi/classement-des-scpi-2025" },
    remake: { nom: "Remake Live", tauxBrut: 7.50, fraisEntree: 10, fraisGestion: 12, tof: 96.0, capitalisation: "125 M€", zone: "Europe", risque: "Modéré", source: "louveinvest.com", sourceUrl: "https://www.louveinvest.com/scpi/meilleures-scpi" },
    iroko: { nom: "Iroko Zen", tauxBrut: 7.32, fraisEntree: 10, fraisGestion: 10, tof: 95.2, capitalisation: "380 M€", zone: "Europe", risque: "Modéré", source: "centraledesscpi.com", sourceUrl: "https://www.centraledesscpi.com/decouvrir-les-scpi/classement-des-scpi-2025" },
    corum: { nom: "Corum Origin", tauxBrut: 6.05, fraisEntree: 0, fraisGestion: 10, tof: 97.0, capitalisation: "6 800 M€", zone: "Monde", risque: "Faible-modéré", source: "centraledesscpi.com", sourceUrl: "https://www.centraledesscpi.com/decouvrir-les-scpi/classement-des-scpi-2025" },
    euodia: { nom: "SCPI Euodia", tauxBrut: 4.50, fraisEntree: 10, fraisGestion: 10, tof: 93.0, capitalisation: "N/A", zone: "Europe", risque: "Modéré", source: "centraledesscpi.com", sourceUrl: "https://www.centraledesscpi.com/decouvrir-les-scpi/classement-des-scpi-2025" }
};

export const PLAFONDS = {
    pea: { limite: 150000, nom: 'PEA Classique' },
    per: { limite: 33000, nom: 'PER (annuel)' },
    pel: { limite: 61200, nom: 'PEL' },
};

export const INITIAL_PARAMS: SimulationParams = {
    capitalTotal: 230000,
    inflationActif: false,
    inflationTaux: 2.0,
    avActif: true,
    avAlloc: 30,
    avRendement: 3.0,
    rente: 850,
    avFrais: 1.0,
    avFraisGestion: 0.7,
    scpiActif: false,
    scpiAlloc: 0,
    scpiProduit: "sofidynamic",
    immoActif: true,
    immoAlloc: 25,
    immoRdt: 6.0,
    immoPV: 2.0,
    taxeFonciere: 300,
    venteImmo: false,
    actionsActif: true,
    actionsAlloc: 30,
    sp500: 70,
    sp500Rdt: 7.8,
    bitcoinRdt: 29.8,
    lombardActif: false,
    lombardAlloc: 0,
    lombardAnnee: 0,
    lombardTaux: 3.0,
    lombardDuree: 5,
    pelActif: true,
    pelTaux: 1.75,
    pelInjection: 'aucun',
    perActif: true,
    perAlloc: 5,
    perRendement: 4.0,
    perFrais: 0.8,
    perTMI: 30
};

export const SCENARIOS = {
    ultraRealiste: {
        name: 'Ultra Réaliste',
        icon: '📊',
        description: 'Données historiques',
        overrides: {}
    },
    pessimiste: {
        name: 'Pessimiste',
        icon: '📉',
        description: 'Marchés difficiles',
        overrides: {
            avRendement: 1.5,
            immoRdt: 4.0,
            immoPV: -1.0,
            sp500Rdt: -2.0,
            bitcoinRdt: 5.0,
            inflationTaux: 4.0,
        }
    },
    neutre: {
        name: 'Neutre',
        icon: '⚖️',
        description: 'Hypothèses conservatrices',
        overrides: {
            avRendement: 2.5,
            immoRdt: 5.0,
            immoPV: 1.0,
            sp500Rdt: 6.0,
            bitcoinRdt: 15.0,
            inflationTaux: 2.5,
        }
    }
};
