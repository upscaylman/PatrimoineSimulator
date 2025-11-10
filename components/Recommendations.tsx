import React from "react";
import { MdCheckCircle, MdLightbulb, MdWarning } from "react-icons/md";
import { SCPI_DATA } from "../constants";
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
    listItems.push(
      `Capital AV: ${synthese.capitalAVDepart.toLocaleString()} € → ${synthese.capitalAVFinal.toLocaleString()} €. Durée rente: ${
        synthese.renteInfinie
          ? "∞ (perpétuelle)"
          : `${synthese.dureeRenteAns}a ${synthese.dureeRenteMois}m`
      }.`
    );
  }

  if (params.scpiActif) {
    const scpiData = SCPI_DATA[params.scpiProduit];
    listItems.push(
      `SCPI ${scpiData.nom}: Rendement net estimé ${(
        scpiData.tauxBrut - scpiData.fraisGestion
      ).toFixed(2)}%. Risque: ${scpiData.risque}.`
    );
  }

  if (params.actionsActif) {
    listItems.push(
      `Actions: S&P500 ${params.sp500.toFixed(0)}% / Bitcoin ${(
        100 - params.sp500
      ).toFixed(0)}%. Le PEA est utilisé en priorité (plafond 150k€).`
    );
  }

  if (params.lombardActif && synthese.montantLombardEmprunte > 0) {
    listItems.push(
      `Crédit Lombard: ${synthese.montantLombardEmprunte.toLocaleString()} € emprunté. Coût total: ${synthese.coutLombardTotal.toLocaleString()} €. Remboursé via flux.`
    );
  }

  if (params.perActif) {
    listItems.push(
      `PER: Économie d'impôt totale de ${synthese.economiesIRPER.toLocaleString()} € grâce à une TMI de ${
        params.perTMI
      }%.`
    );
  }

  if (synthese.capitalNonAlloue > 0) {
    listItems.push({
      text: `${synthese.capitalNonAlloue.toLocaleString()} € non investi, subissant l'inflation sans rendement.`,
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
    text: `Taux de prélèvement global: ${tauxFiscalite}%. Objectif < 25% ${
      objectifAtteint ? "atteint" : "non atteint"
    }.`,
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

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
        <MdLightbulb className="w-5 h-5" />
        Recommandations
      </h3>
      <ul className="space-y-3 list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
        {listItems.map((item, index) => (
          <li key={index} className="flex items-start gap-1">
            {typeof item === "object" && item.icon}
            {typeof item === "object" ? item.text : item}
          </li>
        ))}
      </ul>
    </div>
  );
};
