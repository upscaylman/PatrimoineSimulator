export type Scenario = "ultraRealiste" | "pessimiste" | "neutre";

export interface SimulationParams {
  capitalTotal: number;
  versementPeriodiqueActif: boolean;
  versementFrequence: "mensuel" | "hebdomadaire";
  versementMontant: number;
  inflationActif: boolean;
  inflationTaux: number;
  avActif: boolean;
  avAlloc: number;
  avRendement: number;
  rente: number;
  avFrais: number;
  avFraisGestion: number;
  scpiActif: boolean;
  scpiAlloc: number;
  scpiProduit: string;
  immoActif: boolean;
  immoAlloc: number;
  immoRdt: number;
  immoPV: number;
  taxeFonciere: number;
  venteImmo: boolean;
  actionsActif: boolean;
  actionsAlloc: number;
  sp500: number;
  sp500Rdt: number;
  bitcoinRdt: number;
  lombardActif: boolean;
  lombardAlloc: number;
  lombardAnnee: number;
  lombardTaux: number;
  lombardDuree: number;
  pelActif: boolean;
  pelTaux: number;
  pelInjection: "aucun" | "av" | "lombard";
  perActif: boolean;
  perAlloc: number;
  perRendement: number;
  perFrais: number;
  perTMI: number;
}

export interface ScenarioParams {
  ultraRealiste: SimulationParams;
  pessimiste: SimulationParams;
  neutre: SimulationParams;
}

export interface AnnualResult {
  annee: number;
  avCapital: number;
  scpiCapital: number;
  immoValeur: number;
  sp500: number;
  bitcoin: number;
  pelSolde: number;
  perSolde: number;
  detteLombard: number;
  patrimoineGlobal: number;
  patrimoineNet: number;
  loyersNets: number;
  dividendesSCPI: number;
  interetsLombard: number;
  fiscaliteAnnee: number;
  renteAnnuelle: number;
  remboursementLombard: number;
}

export interface FluxDetail {
  annee: number;
  loyersBruts: number;
  impotsLMNP: number;
  taxeFonciere: number;
  loyersVersPEL: number;
  dividendesSCPI: number;
  fraisGestionSCPI: number;
  flatTaxSCPI: number;
  interetsAV: number;
  fraisGestionAV: number;
  rentesAV: number;
  flatTaxAV: number;
  gainsSP500: number;
  gainsBitcoin: number;
  flatTaxBTC: number;
  interetsLombard: number;
  remboursementLombard: number;
}

export interface Synthesis {
  capitalInitial: number;
  patrimoineFinalNet: number;
  patrimoineFinalNetReel: number;
  plusValueTotale: number;
  plusValueTotaleReelle: number;
  plusValuePct: string;
  plusValuePctReelle: string;
  rentesCumulees: number;
  rentesCumuleesNettes: number;
  dividendesSCPICumules: number;
  pelFinal: number;
  perFinal: number;
  economiesIRPER: number;
  interetsLombardTotaux: number;
  fiscaliteTotale: number;
  rendementAnnuelMoyen: string;
  rendementAnnuelMoyenReel: string;
  detteFinal: number;
  fiscalitePVImmo: number;
  fiscaliteSP500: number;
  fiscaliteBitcoin: number;
  dureeRenteAns: number;
  dureeRenteMois: number;
  dureeRestanteAns: number;
  dureeRestanteMois: number;
  anneesConsommees: number;
  montantLombardEmprunte: number;
  coutLombardTotal: number;
  capitalAVFinal: number;
  capitalAVDepart: number;
  renteStoppee: number | null;
  renteInfinie: boolean;
  inflationCumulee: string;
  capitalNonAlloue: number;
  totalAllocPct: number;
  capitalLombard: number;
}

export interface SimulationResults {
  resultatsAnnuels: AnnualResult[];
  detailsFlux: FluxDetail[];
  synthese: Synthesis;
  params: SimulationParams;
}
