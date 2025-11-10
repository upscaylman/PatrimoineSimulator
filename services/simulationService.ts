
import { FISCALITE, SCPI_DATA } from '../constants';
import type { SimulationParams, SimulationResults, AnnualResult, FluxDetail } from '../types';

function calculerAbattementsPV(annees: number) {
    if (annees <= 5) return { ir: 0, ps: 0 };
    if (annees <= 21) return { ir: (annees - 5) * 0.06, ps: (annees - 5) * 0.0165 };
    if (annees === 22) return { ir: 1.0, ps: 0.28 };
    if (annees <= 30) return { ir: 1.0, ps: Math.min(0.28 + ((annees - 22) * 0.09), 1.0) };
    return { ir: 1.0, ps: 1.0 };
}

function calculerDureeRenteViagere(capital: number, renteAnnuelle: number, tauxRendement: number, tauxFraisGestion: number) {
    if (capital <= 0 || renteAnnuelle <= 0) return { ans: 0, mois: 0 };
    const tauxNet = tauxRendement - tauxFraisGestion;
    if (tauxNet <= 0.001) {
        const dureeAns = capital / renteAnnuelle;
        return { ans: Math.floor(dureeAns), mois: Math.floor((dureeAns % 1) * 12) };
    }
    const interetsAnnuels = capital * tauxNet;
    if (interetsAnnuels >= renteAnnuelle) return { ans: 999, mois: 0 };
    const dureeAns = -Math.log(1 - (tauxNet * capital) / renteAnnuelle) / Math.log(1 + tauxNet);
    return { ans: Math.floor(dureeAns), mois: Math.floor((dureeAns % 1) * 12) };
}

export function calculateSimulation(params: SimulationParams): SimulationResults {
    const { capitalTotal: capitalInitial } = params;
    
    const actionsAllocPct = params.actionsActif ? params.actionsAlloc / 100 : 0;
    const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
    const capitalLombard = params.lombardActif ? (capitalInitial * actionsAllocPct * lombardPct) : 0;
    const capitalTotal = capitalInitial + capitalLombard;
    
    const DUREE = 8;
    const scpiData = SCPI_DATA[params.scpiProduit];
    
    let avCapital = params.avActif ? (capitalTotal * (params.avAlloc / 100) * (1 - (params.avFrais / 100))) : 0;
    let scpiCapital = params.scpiActif ? (capitalTotal * (params.scpiAlloc / 100) * (1 - scpiData.fraisEntree / 100) * (1 - (params.avFrais / 100))) : 0;
    let immoValeur = params.immoActif ? (capitalTotal * (params.immoAlloc / 100)) : 0;
    let sp500 = params.actionsActif ? (capitalTotal * (params.actionsAlloc / 100) * (params.sp500 / 100)) : 0;
    let bitcoin = params.actionsActif ? (capitalTotal * (params.actionsAlloc / 100) * ((100 - params.sp500) / 100)) : 0;
    
    let pelSolde = 0;
    let perSolde = 0;
    let detteLombard = 0;
    let interetsLombardCumules = 0;
    let rentesCumulees = 0;
    let rentesCumuleesNettes = 0;
    let fiscaliteCumulee = 0;
    let dividendesSCPICumules = 0;
    let economiesIRPER = 0;
    let montantLombardEmprunte = 0;
    let renteStoppeeAnnee: number | null = null;
    
    const resultatsAnnuels: AnnualResult[] = [];
    const detailsFlux: FluxDetail[] = [];

    for (let annee = 0; annee <= DUREE; annee++) {
        if (params.lombardActif && annee === params.lombardAnnee && detteLombard === 0) {
            detteLombard = capitalLombard;
            montantLombardEmprunte = detteLombard;
        }

        const interetsAVBruts = params.avActif ? (avCapital * (params.avRendement / 100)) : 0;
        const fraisGestionAV = params.avActif ? (avCapital * (params.avFraisGestion / 100)) : 0;
        const interetsAVNets = interetsAVBruts - fraisGestionAV;
        
        const renteAnnuelle = params.rente * 12;
        let renteEffective = 0;
        let quotiteInterets = 0;
        let fiscaliteRente = 0;
        
        if (params.avActif && renteStoppeeAnnee === null && avCapital > 0) {
            if (avCapital >= renteAnnuelle) {
                renteEffective = renteAnnuelle;
                const totalAV = avCapital + interetsAVNets;
                const quotiteCapital = totalAV > 0 ? (renteAnnuelle * (avCapital / totalAV)) : 0;
                quotiteInterets = renteAnnuelle - quotiteCapital;
            } else {
                renteEffective = avCapital;
                quotiteInterets = 0;
                renteStoppeeAnnee = annee;
            }
        }
        
        const anneesDepuisLombard = annee - params.lombardAnnee;
        const lombardEnCours = params.lombardActif && annee >= params.lombardAnnee && anneesDepuisLombard < params.lombardDuree;
        
        if (!lombardEnCours && quotiteInterets > 0) {
            fiscaliteRente = quotiteInterets * FISCALITE.flatTax;
        }
        
        if (params.avActif) {
            avCapital = Math.max(0, avCapital + interetsAVNets - renteEffective);
        }
        rentesCumulees += renteEffective;
        rentesCumuleesNettes += (renteEffective - fiscaliteRente);
        fiscaliteCumulee += fiscaliteRente;

        const dividendesSCPIBruts = params.scpiActif && annee > 0 ? (scpiCapital * scpiData.tauxBrut / 100) : 0;
        const fraisGestionSCPI = params.scpiActif ? (scpiCapital * scpiData.fraisGestion / 100) : 0;
        const dividendesSCPINets = Math.max(0, dividendesSCPIBruts - fraisGestionSCPI);
        let fiscaliteSCPI = 0;
        
        if (!lombardEnCours && dividendesSCPINets > 0) {
            fiscaliteSCPI = dividendesSCPINets * FISCALITE.flatTax;
        }
        
        const dividendesSCPIApresImpot = dividendesSCPINets - fiscaliteSCPI;
        dividendesSCPICumules += dividendesSCPIApresImpot;
        fiscaliteCumulee += fiscaliteSCPI;

        const loyersAnnuelsBruts = params.immoActif ? (immoValeur * (annee === 0 ? 0 : (params.immoRdt / 100))) : 0;
        const loyersImposables = loyersAnnuelsBruts * (1 - FISCALITE.lmnpAbattement);
        const fiscaliteImmo = loyersImposables * (FISCALITE.lmnpIR + FISCALITE.lmnpPS);
        const loyersNets = Math.max(0, loyersAnnuelsBruts - params.taxeFonciere - fiscaliteImmo);
        
        if (params.immoActif) {
            immoValeur *= (1 + (params.immoPV / 100));
        }
        fiscaliteCumulee += fiscaliteImmo;

        let remboursementLombard = 0;
        let interetsLombard = 0;
        
        if (lombardEnCours && detteLombard > 0) {
            interetsLombard = detteLombard * (params.lombardTaux / 100);
            interetsLombardCumules += interetsLombard;
            
            let disponible = loyersNets + dividendesSCPIApresImpot;
            if (params.pelInjection === 'lombard' && pelSolde > 0 && params.pelActif) {
                disponible += pelSolde;
                pelSolde = 0;
            }
            
            const remboursementCapital = montantLombardEmprunte / params.lombardDuree;
            const totalAnnuel = remboursementCapital + interetsLombard;
            
            if (disponible >= totalAnnuel) {
                remboursementLombard = remboursementCapital;
                detteLombard = Math.max(0, detteLombard - remboursementCapital);
                const versementPEL = disponible - totalAnnuel;
                if (versementPEL > 0 && params.pelActif) {
                    pelSolde += versementPEL;
                } else if (!params.pelActif && versementPEL > 0 && params.avActif) {
                    avCapital += versementPEL;
                }
            } else if (disponible >= interetsLombard) {
                remboursementLombard = disponible - interetsLombard;
                detteLombard = Math.max(0, detteLombard - remboursementLombard);
            } else {
                detteLombard += (interetsLombard - disponible);
                remboursementLombard = 0;
            }
        } else {
            const fluxDisponibles = loyersNets + dividendesSCPIApresImpot;
            if (params.pelActif) {
                pelSolde += fluxDisponibles;
            } else if (params.avActif) {
                avCapital += fluxDisponibles;
            }
        }

        if (params.pelActif) {
            const interetsPEL = pelSolde * (params.pelTaux / 100);
            const fiscalitePEL = interetsPEL * FISCALITE.flatTax;
            pelSolde += interetsPEL - fiscalitePEL;
            fiscaliteCumulee += fiscalitePEL;
        }

        if (params.perActif && annee > 0) {
            const versementPER = capitalTotal * (params.perAlloc / 100) / DUREE;
            economiesIRPER += versementPER * (params.perTMI / 100);
            
            const interetsPERBruts = perSolde * (params.perRendement / 100);
            const fraisGestionPER = perSolde * (params.perFrais / 100);
            
            perSolde += versementPER + interetsPERBruts - fraisGestionPER;
        }

        sp500 += params.actionsActif ? (sp500 * (params.sp500Rdt / 100)) : 0;
        bitcoin += params.actionsActif ? (bitcoin * (params.bitcoinRdt / 100)) : 0;

        if (annee === DUREE && params.pelInjection === 'av' && pelSolde > 0 && params.pelActif && params.avActif) {
            avCapital += pelSolde * (1 - (params.avFrais / 100));
            pelSolde = 0;
        }

        const patrimoineGlobal = avCapital + scpiCapital + immoValeur + sp500 + bitcoin + pelSolde + perSolde;
        resultatsAnnuels.push({ annee, avCapital, scpiCapital, immoValeur, sp500, bitcoin, pelSolde, perSolde, detteLombard, patrimoineGlobal, patrimoineNet: patrimoineGlobal - detteLombard, loyersNets, dividendesSCPI: dividendesSCPIApresImpot, interetsLombard, fiscaliteAnnee: fiscaliteRente + fiscaliteImmo + fiscaliteSCPI, renteAnnuelle: renteEffective, remboursementLombard });
        detailsFlux.push({ annee, loyersBruts: loyersAnnuelsBruts, impotsLMNP: fiscaliteImmo, taxeFonciere: params.taxeFonciere, loyersVersPEL: loyersNets, dividendesSCPI: dividendesSCPIBruts, fraisGestionSCPI, flatTaxSCPI: fiscaliteSCPI, interetsAV: interetsAVNets, fraisGestionAV, rentesAV: renteEffective, flatTaxAV: fiscaliteRente, gainsSP500: sp500 * (params.sp500Rdt / 100), gainsBitcoin: bitcoin * (params.bitcoinRdt / 100), flatTaxBTC: (bitcoin * (params.bitcoinRdt / 100)) * FISCALITE.flatTax, interetsLombard, remboursementLombard });
    }

    const dernierResultat = resultatsAnnuels[DUREE];
    let immoFinal = dernierResultat.immoValeur;
    let fiscalitePVImmo = 0;
    
    if (params.venteImmo && params.immoActif) {
        const prixAchat = capitalTotal * (params.immoAlloc / 100);
        const plusValueBrute = Math.max(0, dernierResultat.immoValeur - prixAchat);
        const abattements = calculerAbattementsPV(DUREE);
        const pvImposableIR = plusValueBrute * (1 - abattements.ir);
        const pvImposablePS = plusValueBrute * (1 - abattements.ps);
        fiscalitePVImmo = (pvImposableIR * FISCALITE.pvImmoIR) + (pvImposablePS * FISCALITE.psSeul);
        immoFinal = dernierResultat.immoValeur - fiscalitePVImmo;
        fiscaliteCumulee += fiscalitePVImmo;
    }

    const plusValueSP500 = params.actionsActif ? Math.max(0, dernierResultat.sp500 - (capitalTotal * actionsAllocPct * (params.sp500 / 100))) : 0;
    const fiscaliteSP500 = plusValueSP500 * FISCALITE.psSeul;
    const plusValueBitcoin = params.actionsActif ? Math.max(0, dernierResultat.bitcoin - (capitalTotal * actionsAllocPct * ((100 - params.sp500) / 100))) : 0;
    const fiscaliteBitcoin = plusValueBitcoin * FISCALITE.flatTax;
    const bourseNette = dernierResultat.sp500 + dernierResultat.bitcoin - fiscaliteSP500 - fiscaliteBitcoin;
    fiscaliteCumulee += fiscaliteSP500 + fiscaliteBitcoin;

    const totalAllocPct = (params.avActif ? params.avAlloc : 0) + (params.scpiActif ? params.scpiAlloc : 0) + (params.immoActif ? params.immoAlloc : 0) + (params.actionsActif ? params.actionsAlloc : 0) + (params.perActif ? params.perAlloc : 0);
    const capitalNonAlloue = params.capitalTotal * (1 - totalAllocPct / 100);

    let patrimoineFinalNet = dernierResultat.avCapital + dernierResultat.scpiCapital + immoFinal + bourseNette + dernierResultat.pelSolde + dernierResultat.perSolde - dernierResultat.detteLombard + capitalNonAlloue;
    
    let patrimoineFinalNetReel = patrimoineFinalNet;
    if (params.inflationActif) {
        patrimoineFinalNetReel /= Math.pow(1 + (params.inflationTaux / 100), DUREE);
    }
    
    const plusValueTotale = patrimoineFinalNet - capitalInitial;
    const plusValueTotaleReelle = patrimoineFinalNetReel - capitalInitial;
    
    const capitalPourRente = params.avActif ? (capitalTotal * (params.avAlloc / 100) * (1 - (params.avFrais / 100))) : 0;
    const dureeRenteTotale = params.avActif ? calculerDureeRenteViagere(capitalPourRente, params.rente * 12, params.avRendement / 100, params.avFraisGestion / 100) : { ans: 0, mois: 0 };
    const anneesConsommees = params.rente > 0 ? (rentesCumulees / (params.rente * 12)) : 0;
    
    let dureeRestante = { ans: 0, mois: 0 };
    if (dureeRenteTotale.ans < 999 && params.avActif) {
        const dureeRestanteAns = Math.max(0, dureeRenteTotale.ans + (dureeRenteTotale.mois / 12) - anneesConsommees);
        dureeRestante = { ans: Math.floor(dureeRestanteAns), mois: Math.floor((dureeRestanteAns % 1) * 12) };
    } else if (params.avActif) {
        dureeRestante = dureeRenteTotale;
    }
    
    return {
// Fix: Use 'as unknown as Type' to fix TypeScript casting error when dynamically creating an object after rounding values.
        resultatsAnnuels: resultatsAnnuels.map(r => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Math.round(v)])) as unknown as AnnualResult),
// Fix: Use 'as unknown as Type' to fix TypeScript casting error when dynamically creating an object after rounding values.
        detailsFlux: detailsFlux.map(f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Math.round(v)])) as unknown as FluxDetail),
        synthese: {
            capitalInitial, patrimoineFinalNet, patrimoineFinalNetReel, plusValueTotale, plusValueTotaleReelle,
            plusValuePct: capitalInitial > 0 ? ((plusValueTotale / capitalInitial) * 100).toFixed(2) : '0.00',
            plusValuePctReelle: capitalInitial > 0 ? ((plusValueTotaleReelle / capitalInitial) * 100).toFixed(2) : '0.00',
            rentesCumulees, rentesCumuleesNettes, dividendesSCPICumules, pelFinal: dernierResultat.pelSolde, perFinal: dernierResultat.perSolde, economiesIRPER, interetsLombardTotaux: interetsLombardCumules, fiscaliteTotale: fiscaliteCumulee,
            rendementAnnuelMoyen: Math.abs(plusValueTotale) > 1 && capitalInitial > 0 ? (plusValueTotale / capitalInitial / DUREE * 100).toFixed(2) : '0.00',
            rendementAnnuelMoyenReel: params.inflationActif ? (Math.abs(plusValueTotaleReelle) > 1 && capitalInitial > 0 ? (plusValueTotaleReelle / capitalInitial / DUREE * 100).toFixed(2) : (-params.inflationTaux).toFixed(2)) : (Math.abs(plusValueTotale) > 1 && capitalInitial > 0 ? (plusValueTotale / capitalInitial / DUREE * 100).toFixed(2) : '0.00'),
            detteFinal: dernierResultat.detteLombard, fiscalitePVImmo, fiscaliteSP500, fiscaliteBitcoin,
            dureeRenteAns: dureeRenteTotale.ans, dureeRenteMois: dureeRenteTotale.mois,
            dureeRestanteAns: dureeRestante.ans, dureeRestanteMois: dureeRestante.mois, anneesConsommees,
            montantLombardEmprunte, coutLombardTotal: interetsLombardCumules,
            capitalAVFinal: dernierResultat.avCapital, capitalAVDepart: capitalPourRente, renteStoppee: renteStoppeeAnnee,
            renteInfinie: dureeRenteTotale.ans >= 999,
            inflationCumulee: params.inflationActif ? ((Math.pow(1 + params.inflationTaux / 100, DUREE) - 1) * 100).toFixed(2) : '0',
            capitalNonAlloue, totalAllocPct, capitalLombard,
        },
        params,
    };
}
