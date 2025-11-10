import React from "react";
import type { SimulationResults } from "../../types";
import { ResultsTables } from "../ResultsTables";

interface ResultsTableauxProps {
  results: SimulationResults;
}

export const ResultsTableaux: React.FC<ResultsTableauxProps> = ({
  results,
}) => {
  const { resultatsAnnuels, detailsFlux, params } = results;

  return (
    <div className="animate-fade-in">
      <ResultsTables
        resultatsAnnuels={resultatsAnnuels}
        detailsFlux={detailsFlux}
        params={params}
      />
    </div>
  );
};
