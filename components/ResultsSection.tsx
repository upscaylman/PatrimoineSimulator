import React from "react";
import {
  MdAccessTime,
  MdAccountBalanceWallet,
  MdBarChart,
  MdDiamond,
  MdPayments,
  MdTrendingUp,
} from "react-icons/md";
import type { SimulationResults } from "../types";
import { ChartWrapper } from "./ChartWrapper";
import { Recommendations } from "./Recommendations";
import { ResultsTables } from "./ResultsTables";
import { Risks } from "./Risks";
import { SummaryCard } from "./SummaryCard";
import { TopAllocations } from "./TopAllocations";

interface ResultsSectionProps {
  results: SimulationResults;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const { synthese, resultatsAnnuels, detailsFlux, params } = results;

  const patrimoineChartData = {
    labels: resultatsAnnuels.map((d) => `An ${d.annee}`),
    datasets: [
      {
        label: "Patrimoine Net",
        data: resultatsAnnuels.map((d) => d.patrimoineNet),
        borderColor: "hsl(252, 75%, 66%)",
        backgroundColor: "hsla(252, 75%, 66%, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const compositionChartData = {
    labels: resultatsAnnuels.map((d) => `An ${d.annee}`),
    datasets: [
      ...(params.avActif
        ? [
            {
              label: "Assurance Vie",
              data: resultatsAnnuels.map((d) => d.avCapital),
              backgroundColor: "#10b981",
            },
          ]
        : []),
      ...(params.scpiActif
        ? [
            {
              label: "SCPI",
              data: resultatsAnnuels.map((d) => d.scpiCapital),
              backgroundColor: "#f59e0b",
            },
          ]
        : []),
      ...(params.immoActif
        ? [
            {
              label: "Immobilier",
              data: resultatsAnnuels.map((d) => d.immoValeur),
              backgroundColor: "#ef4444",
            },
          ]
        : []),
      ...(params.actionsActif
        ? [
            {
              label: "S&P500",
              data: resultatsAnnuels.map((d) => d.sp500),
              backgroundColor: "#3b82f6",
            },
          ]
        : []),
      ...(params.actionsActif
        ? [
            {
              label: "Bitcoin",
              data: resultatsAnnuels.map((d) => d.bitcoin),
              backgroundColor: "#8b5cf6",
            },
          ]
        : []),
      ...(params.pelActif
        ? [
            {
              label: "PEL",
              data: resultatsAnnuels.map((d) => d.pelSolde),
              backgroundColor: "#06b6d4",
            },
          ]
        : []),
      ...(params.perActif
        ? [
            {
              label: "PER",
              data: resultatsAnnuels.map((d) => d.perSolde),
              backgroundColor: "#a855f7",
            },
          ]
        : []),
    ],
  };

  const fluxChartData = {
    labels: resultatsAnnuels.map((d) => `An ${d.annee}`),
    datasets: [
      {
        label: "Loyers nets",
        data: resultatsAnnuels.map((d) => d.loyersNets),
        backgroundColor: "#10b981",
      },
      {
        label: "Dividendes SCPI",
        data: resultatsAnnuels.map((d) => d.dividendesSCPI),
        backgroundColor: "#f59e0b",
      },
      {
        label: "Rente AV",
        data: resultatsAnnuels.map((d) => d.renteAnnuelle),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Intérêts Lombard",
        data: resultatsAnnuels.map((d) => -d.interetsLombard),
        backgroundColor: "#ef4444",
      },
      {
        label: "Remb. Lombard",
        data: resultatsAnnuels.map((d) => -d.remboursementLombard),
        backgroundColor: "#f97316",
      },
    ],
  };

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary flex items-center gap-3">
        <MdBarChart size={36} />
        Résultats de la Simulation
      </h2>

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
              : `Restant: ${synthese.dureeRestanteAns}a ${synthese.dureeRestanteMois}m`
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-light dark:bg-surface-container-dark p-6 rounded-3xl">
          <ChartWrapper
            type="line"
            data={patrimoineChartData}
            title="Évolution du Patrimoine Net (8 ans)"
          />
        </div>
        <div className="bg-surface-container-light dark:bg-surface-container-dark p-6 rounded-3xl">
          <ChartWrapper
            type="bar"
            data={compositionChartData}
            title="Composition du Patrimoine"
            options={{ scales: { x: { stacked: true }, y: { stacked: true } } }}
          />
        </div>
      </div>
      <div className="bg-surface-container-light dark:bg-surface-container-dark p-6 rounded-3xl mb-6">
        <ChartWrapper
          type="bar"
          data={fluxChartData}
          title="Flux Financiers Annuels"
        />
      </div>

      <ResultsTables
        resultatsAnnuels={resultatsAnnuels}
        detailsFlux={detailsFlux}
        params={params}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Recommendations synthese={synthese} params={params} />
        <Risks synthese={synthese} params={params} />
      </div>

      <TopAllocations params={params} />
    </div>
  );
};
