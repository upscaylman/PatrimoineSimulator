import React from "react";
import { MdCheckCircle, MdLightbulb, MdWarning } from "react-icons/md";
import { PLAFONDS, SCPI_DATA } from "../constants";
import type { SimulationParams, Synthesis } from "../types";

interface RecommendationsProps {
  synthese: Synthesis;
  params: SimulationParams;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  synthese,
  params,
}) => {
  const listItems: Array<string | { text: string; icon?: React.ReactNode }> =
    [];

  if (params.avActif) {
    const dureeRente = synthese.renteInfinie
      ? "∞ (perpétuelle)"
      : `${synthese.dureeRenteAns}a ${synthese.dureeRenteMois}m`;
    listItems.push(
      `<strong>Assurance Vie :</strong> Capital ${synthese.capitalAVDepart.toLocaleString()} € → ${synthese.capitalAVFinal.toLocaleString()} € • Aucun plafond légal • Durée rente : ${dureeRente}`
    );
  }

  if (params.scpiActif) {
    const scpiData = SCPI_DATA[params.scpiProduit];
    const rendementNet = scpiData.tauxBrut - scpiData.fraisGestion;
    listItems.push(
      `<strong>SCPI ${
        scpiData.nom
      } :</strong> Rendement net estimé ${rendementNet.toFixed(2)}% (${
        scpiData.tauxBrut
      }% - ${scpiData.fraisGestion}% frais) • TOF ${scpiData.tof}% • Risque : ${
        scpiData.risque
      } • Aucun plafond`
    );
  }

  if (params.immoActif) {
    listItems.push(
      `<strong>Immobilier LMNP :</strong> Abattement 50% sur loyers • Rendement locatif ${params.immoRdt.toFixed(
        1
      )}% • PV annuelle ${params.immoPV.toFixed(1)}% • Aucun plafond`
    );
  }

  if (params.actionsActif) {
    const actionsAllocPct = params.actionsAlloc / 100;
    const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
    const capitalLombard = params.lombardActif
      ? params.capitalTotal * actionsAllocPct * lombardPct
      : 0;
    const capitalTotalAvecLombard = params.capitalTotal + capitalLombard;
    const montantActions = capitalTotalAvecLombard * actionsAllocPct;
    const montantPEA = Math.min(montantActions, PLAFONDS.pea.limite);
    const montantCTO = Math.max(0, montantActions - PLAFONDS.pea.limite);

    let actionsText = `<strong>Actions :</strong> S&P500 ${params.sp500.toFixed(
      0
    )}% • Bitcoin ${(100 - params.sp500).toFixed(0)}%`;
    if (montantCTO > 0) {
      actionsText += ` • PEA : ${montantPEA.toLocaleString()} € (plafond atteint) + CTO : ${montantCTO.toLocaleString()} € (excédent)`;
    } else {
      actionsText += ` • PEA : ${montantPEA.toLocaleString()} € (plafond 150k€)`;
    }
    listItems.push(actionsText);
  }

  if (params.lombardActif && synthese.montantLombardEmprunte > 0) {
    listItems.push(
      `<strong>Crédit Lombard :</strong> ${synthese.montantLombardEmprunte.toLocaleString()} € emprunté (année ${
        params.lombardAnnee
      }) • Capital ajouté à votre allocation • Coût intérêts : ${synthese.coutLombardTotal.toLocaleString()} € • Remboursement sur flux (loyers + dividendes)`
    );
  }

  if (params.pelActif) {
    const pelInjectionText =
      params.pelInjection === "aucun"
        ? "Conservé"
        : params.pelInjection === "av"
        ? "Injecté dans AV année 8"
        : "Remboursement Lombard anticipé";
    listItems.push(
      `<strong>PEL :</strong> Taux ${params.pelTaux.toFixed(
        2
      )}% brut • Plafond 61 200 € • Flat tax 30% • ${pelInjectionText}`
    );
  }

  if (params.perActif) {
    const actionsAllocPct = params.actionsAlloc / 100;
    const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
    const capitalLombard = params.lombardActif
      ? params.capitalTotal * actionsAllocPct * lombardPct
      : 0;
    const capitalTotalAvecLombard = params.capitalTotal + capitalLombard;
    const versementAnnuel = Math.round(
      (capitalTotalAvecLombard * (params.perAlloc / 100)) / 8
    );
    listItems.push(
      `<strong>PER :</strong> Versement annuel ${versementAnnuel.toLocaleString()} € • Plafond ${PLAFONDS.per.limite.toLocaleString()} €/an (10% revenus) • Économie IR ${synthese.economiesIRPER.toLocaleString()} € (TMI ${params.perTMI.toFixed(
        0
      )}%) • Capital final ${synthese.perFinal.toLocaleString()} €`
    );
  }

  if (params.inflationActif) {
    listItems.push(
      `<strong>Inflation :</strong> Taux ${params.inflationTaux.toFixed(
        1
      )}%/an • Impact sur 8 ans : ${
        synthese.inflationCumulee
      }% • Patrimoine réel final : ${synthese.patrimoineFinalNetReel.toLocaleString()} € (vs ${synthese.patrimoineFinalNet.toLocaleString()} € nominal)`
    );
  }

  if (synthese.capitalNonAlloue > 0) {
    const capitalNonAlloueReel = params.inflationActif
      ? Math.round(
          synthese.capitalNonAlloue /
            Math.pow(1 + params.inflationTaux / 100, 8)
        )
      : synthese.capitalNonAlloue;
    const perteInflation = params.inflationActif
      ? Math.round(synthese.capitalNonAlloue - capitalNonAlloueReel)
      : 0;
    const pctNonAlloue = ((1 - synthese.totalAllocPct / 100) * 100).toFixed(1);
    listItems.push({
      text: `<strong>⚠️ Capital non investi :</strong> ${synthese.capitalNonAlloue.toLocaleString()} € conservé en cash (${pctNonAlloue}%) • ${
        params.inflationActif
          ? `Valeur réelle : ${capitalNonAlloueReel.toLocaleString()} € (perte : ${perteInflation.toLocaleString()} €)`
          : "Aucun rendement"
      }`,
      icon: (
        <span className="inline-flex items-center mr-1">
          <MdWarning size={16} />
        </span>
      ),
    });
  }

  const tauxFiscalite =
    Math.abs(synthese.plusValueTotale) > 0
      ? (
          (synthese.fiscaliteTotale / Math.abs(synthese.plusValueTotale)) *
          100
        ).toFixed(1)
      : "0.0";
  const objectifAtteint = parseFloat(tauxFiscalite) < 25;
  listItems.push({
    text: `<strong>Taux de prélèvement global :</strong> ${tauxFiscalite}% ${
      objectifAtteint ? "✓ Objectif atteint" : "⚠️ Objectif < 25%"
    }`,
    icon: objectifAtteint ? (
      <span className="inline-flex items-center mr-1">
        <MdCheckCircle size={16} />
      </span>
    ) : (
      <span className="inline-flex items-center mr-1">
        <MdWarning size={16} />
      </span>
    ),
  });

  listItems.push(
    `<strong>Modules actifs :</strong> ${params.avActif ? "✓ AV" : "✗ AV"} | ${
      params.scpiActif ? "✓ SCPI" : "✗ SCPI"
    } | ${params.immoActif ? "✓ Immo" : "✗ Immo"} | ${
      params.actionsActif ? "✓ Actions" : "✗ Actions"
    } | ${params.lombardActif ? "✓ Lombard" : "✗ Lombard"} | ${
      params.pelActif ? "✓ PEL" : "✗ PEL"
    } | ${params.perActif ? "✓ PER" : "✗ PER"}`
  );

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
        <MdLightbulb className="w-5 h-5" />
        Recommandations Personnalisées
      </h3>
      <ul className="space-y-3 list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
        {listItems.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-1"
            dangerouslySetInnerHTML={{
              __html:
                typeof item === "object" && item.icon
                  ? `${item.icon} ${item.text}`
                  : typeof item === "object"
                  ? item.text
                  : item,
            }}
          />
        ))}
      </ul>
    </div>
  );
};
