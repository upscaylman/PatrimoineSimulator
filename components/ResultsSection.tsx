import React, { useEffect, useState } from "react";
import type { SimulationResults } from "../types";
import { ResultsTabs } from "./ResultsTabs";
import { ResultsAnalyse } from "./results/ResultsAnalyse";
import { ResultsGraphiques } from "./results/ResultsGraphiques";
import { ResultsSynthese } from "./results/ResultsSynthese";
import { ResultsTableaux } from "./results/ResultsTableaux";

type ResultsTab = "synthese" | "graphiques" | "tableaux" | "analyse";

interface ResultsSectionProps {
  results: SimulationResults;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<ResultsTab>(() => {
    const saved = localStorage.getItem("activeResultsTab");
    return (saved as ResultsTab) || "synthese";
  });

  useEffect(() => {
    localStorage.setItem("activeResultsTab", activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "synthese":
        return <ResultsSynthese results={results} />;
      case "graphiques":
        return <ResultsGraphiques results={results} />;
      case "tableaux":
        return <ResultsTableaux results={results} />;
      case "analyse":
        return <ResultsAnalyse results={results} />;
      default:
        return <ResultsSynthese results={results} />;
    }
  };

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Résultats de la Simulation
      </h2>
      <ResultsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};
