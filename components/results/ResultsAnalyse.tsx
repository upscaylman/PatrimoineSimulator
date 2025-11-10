import React from "react";
import type { SimulationResults } from "../../types";
import { Recommendations } from "../Recommendations";
import { Risks } from "../Risks";

interface ResultsAnalyseProps {
  results: SimulationResults;
}

export const ResultsAnalyse: React.FC<ResultsAnalyseProps> = ({ results }) => {
  const { synthese, params } = results;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Recommendations synthese={synthese} params={params} />
        <Risks synthese={synthese} params={params} />
      </div>
    </div>
  );
};
