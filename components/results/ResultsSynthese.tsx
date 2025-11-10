import React from "react";
import {
  MdAccessTime,
  MdAccountBalanceWallet,
  MdBarChart,
  MdDiamond,
  MdPayments,
  MdTrendingUp,
} from "react-icons/md";
import type { SimulationResults } from "../../types";
import { SummaryCard } from "../SummaryCard";
import { TopAllocations } from "../TopAllocations";

interface ResultsSyntheseProps {
  results: SimulationResults;
}

export const ResultsSynthese: React.FC<ResultsSyntheseProps> = ({
  results,
}) => {
  const { synthese, params } = results;

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
            params.inflationActif
              ? `Réel: ${synthese.patrimoineFinalNetReel.toLocaleString()} €`
              : ""
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
          value={synthese.plusValueTotale}
          isCurrency={true}
          subtext={`(${synthese.plusValuePct}%)`}
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
          subtext={`Net: ${synthese.rentesCumuleesNettes.toLocaleString()} €`}
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
            params.perActif
              ? `Éco IR PER: -${synthese.economiesIRPER.toLocaleString()} €`
              : ""
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
            synthese.renteInfinie
              ? "∞"
              : `${synthese.dureeRenteAns}a ${synthese.dureeRenteMois}m`
          }
          subtext={
            synthese.renteInfinie
              ? "Rente perpétuelle"
              : `Restant: ${synthese.dureeRenteAns}a ${synthese.dureeRenteMois}m`
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
            params.inflationActif
              ? `Réel: ${synthese.rendementAnnuelMoyenReel}%`
              : ""
          }
        />
      </div>

      <TopAllocations params={params} />
    </div>
  );
};
