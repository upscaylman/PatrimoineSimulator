import React from "react";
import {
  MdAccessTime,
  MdAccountBalanceWallet,
  MdBarChart,
  MdBusinessCenter,
  MdCheckCircle,
  MdDiamond,
  MdPayments,
  MdShowChart,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";
import type { SimulationResults } from "../../types";
import { SummaryCard } from "../SummaryCard";

interface ResultsSyntheseProps {
  results: SimulationResults;
}

export const ResultsSynthese: React.FC<ResultsSyntheseProps> = ({
  results,
}) => {
  const { synthese, params } = results;

  // Construire la liste des modules actifs
  const modulesActifs: string[] = [];
  if (params.avActif) modulesActifs.push("AV");
  if (params.scpiActif) modulesActifs.push("SCPI");
  if (params.immoActif) modulesActifs.push("Immo");
  if (params.actionsActif) modulesActifs.push("Actions");
  if (params.pelActif) modulesActifs.push("PEL");
  if (params.perActif) modulesActifs.push("PER");
  if (synthese.capitalNonAlloue > 0) modulesActifs.push("Cash");
  if (synthese.capitalLombard > 0) modulesActifs.push("Lombard");

  const modulesText = modulesActifs.join(" + ");

  // Calculer les valeurs pour Capital Non Investi
  const capitalNonAlloueReel = params.inflationActif
    ? Math.round(
        synthese.capitalNonAlloue / Math.pow(1 + params.inflationTaux / 100, 8)
      )
    : synthese.capitalNonAlloue;
  const perteInflation = params.inflationActif
    ? Math.round(synthese.capitalNonAlloue - capitalNonAlloueReel)
    : 0;
  const pctNonAlloue = ((1 - synthese.totalAllocPct / 100) * 100).toFixed(1);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdDiamond size={16} />
              </span>
              Patrimoine Final (NET)
            </>
          }
          value={synthese.patrimoineFinalNet}
          isCurrency={true}
          subtext={
            <>
              {modulesText}
              {params.inflationActif && (
                <>
                  <br />
                  Réel (inflation):{" "}
                  {synthese.patrimoineFinalNetReel.toLocaleString()} €
                </>
              )}
              {synthese.detteFinal > 0 && (
                <>
                  <br />
                  <span className="text-yellow-200 flex items-center gap-1">
                    <MdWarning size={14} />
                    Après déduction dette Lombard (
                    {synthese.detteFinal.toLocaleString()} €)
                  </span>
                </>
              )}
            </>
          }
        />
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdTrendingUp size={16} />
              </span>
              Plus-Value Totale (NET)
            </>
          }
          value={`+${synthese.plusValueTotale.toLocaleString()} €`}
          isCurrency={false}
          subtext={
            <>
              ({synthese.plusValuePct}%)
              {params.inflationActif && (
                <>
                  <br />
                  Réel : +{synthese.plusValueTotaleReelle.toLocaleString()} € (
                  {synthese.plusValuePctReelle}%)
                </>
              )}
            </>
          }
        />
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdAccountBalanceWallet size={16} />
              </span>
              Rentes Perçues
            </>
          }
          value={synthese.rentesCumulees}
          isCurrency={true}
          subtext={`Brut • Net : ${synthese.rentesCumuleesNettes.toLocaleString()} €`}
        />
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdPayments size={16} />
              </span>
              Impôts Totaux
            </>
          }
          value={synthese.fiscaliteTotale}
          isCurrency={true}
          subtext={
            <>
              Flat tax + LMNP + PV
              {params.perActif && (
                <>
                  <br />
                  Économie IR PER : -{synthese.economiesIRPER.toLocaleString()}{" "}
                  €
                </>
              )}
            </>
          }
        />
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdAccessTime size={16} />
              </span>
              Durée Totale Rente
            </>
          }
          value={
            params.avActif
              ? synthese.renteInfinie
                ? "∞ (perpétuelle)"
                : `${synthese.dureeRenteAns} ans ${synthese.dureeRenteMois} mois`
              : "N/A"
          }
          subtext={
            params.avActif ? (
              <>
                {synthese.renteInfinie ? (
                  "Rendement net AV ≥ rente"
                ) : (
                  <>
                    Utilisé : {Math.floor(synthese.anneesConsommees)} ans |
                    Restant : {synthese.dureeRestanteAns}a{" "}
                    {synthese.dureeRestanteMois}m
                  </>
                )}
                {synthese.renteStoppee !== null && (
                  <>
                    <br />
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-yellow-400 text-yellow-900">
                      <MdWarning size={14} />
                      Capital épuisé en année {synthese.renteStoppee}
                    </span>
                  </>
                )}
                {synthese.renteInfinie && synthese.renteStoppee === null && (
                  <>
                    <br />
                    <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-green-500 text-white">
                      <MdCheckCircle size={14} />
                      Rente perpétuelle
                    </span>
                  </>
                )}
              </>
            ) : (
              ""
            )
          }
        />
        <SummaryCard
          title={
            <>
              <span className="inline-flex items-center mr-1">
                <MdBarChart size={16} />
              </span>
              Rendement Annuel (NET)
            </>
          }
          value={parseFloat(synthese.rendementAnnuelMoyen)}
          isPercent={true}
          subtext={
            <>
              Performance après impôts
              {params.inflationActif && (
                <>
                  <br />
                  Réel : {synthese.rendementAnnuelMoyenReel}% (inflation :{" "}
                  {synthese.inflationCumulee}%)
                </>
              )}
            </>
          }
        />

        {/* Capital Non Investi - Carte conditionnelle */}
        {synthese.capitalNonAlloue > 0 && (
          <SummaryCard
            title={
              <>
                <span className="inline-flex items-center mr-1">
                  <MdWarning size={16} />
                </span>
                Capital Non Investi
              </>
            }
            value={synthese.capitalNonAlloue}
            isCurrency={true}
            subtext={
              <>
                Conservé en cash ({pctNonAlloue}%)
                {params.inflationActif ? (
                  <>
                    <br />
                    Valeur réelle: {capitalNonAlloueReel.toLocaleString()} €
                    <br />
                    (perte: {perteInflation.toLocaleString()} €)
                  </>
                ) : (
                  <>
                    <br />
                    Aucun rendement
                  </>
                )}
              </>
            }
            customGradient="bg-gradient-to-br from-orange-500 to-red-500"
          />
        )}

        {/* Dividendes SCPI - Carte conditionnelle */}
        {params.scpiActif && synthese.dividendesSCPICumules > 0 && (
          <SummaryCard
            title={
              <>
                <span className="inline-flex items-center mr-1">
                  <MdBusinessCenter size={16} />
                </span>
                Dividendes SCPI (NET)
              </>
            }
            value={synthese.dividendesSCPICumules}
            isCurrency={true}
            subtext={`Sur 8 ans • Vers ${params.pelActif ? "PEL" : "AV"}`}
          />
        )}

        {/* Crédit Lombard - Carte conditionnelle */}
        {params.lombardActif && synthese.montantLombardEmprunte > 0 && (
          <SummaryCard
            title={
              <>
                <span className="inline-flex items-center mr-1">
                  <MdAccountBalanceWallet size={16} />
                </span>
                Crédit Lombard
              </>
            }
            value={synthese.montantLombardEmprunte}
            isCurrency={true}
            subtext={
              <>
                Emprunté (année {params.lombardAnnee})
                <br />
                Coût intérêts: {synthese.coutLombardTotal.toLocaleString()} €
              </>
            }
          />
        )}

        {/* PER Final - Carte conditionnelle */}
        {params.perActif && synthese.perFinal > 0 && (
          <SummaryCard
            title={
              <>
                <span className="inline-flex items-center mr-1">
                  <MdShowChart size={16} />
                </span>
                PER Final (NET)
              </>
            }
            value={synthese.perFinal}
            isCurrency={true}
            subtext={
              <>
                Dispo à 62 ans
                <br />
                Éco IR: {synthese.economiesIRPER.toLocaleString()} €
              </>
            }
          />
        )}
      </div>
    </div>
  );
};
