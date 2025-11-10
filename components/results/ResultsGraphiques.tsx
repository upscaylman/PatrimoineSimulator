import React from "react";
import type { SimulationResults } from "../../types";
import { ChartWrapper } from "../ChartWrapper";

interface ResultsGraphiquesProps {
  results: SimulationResults;
}

export const ResultsGraphiques: React.FC<ResultsGraphiquesProps> = ({
  results,
}) => {
  const { resultatsAnnuels, params } = results;

  const patrimoineChartData = {
    labels: resultatsAnnuels.map((d) => `An ${d.annee}`),
    datasets: [
      {
        label: "Patrimoine Net",
        data: resultatsAnnuels.map((d) => d.patrimoineNet),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
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
              backgroundColor: "#2563eb",
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
              backgroundColor: "#2563eb",
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
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="bg-surface-container-light dark:bg-surface-container-dark p-6 rounded-3xl">
        <ChartWrapper
          type="bar"
          data={fluxChartData}
          title="Flux Financiers Annuels"
        />
      </div>
    </div>
  );
};
