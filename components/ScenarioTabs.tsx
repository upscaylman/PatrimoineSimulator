import React from "react";
import { SCENARIOS } from "../constants";
import type { Scenario } from "../types";

interface ScenarioTabsProps {
  currentScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
}

export const ScenarioTabs: React.FC<ScenarioTabsProps> = ({
  currentScenario,
  onScenarioChange,
}) => {
  return (
    <div className="mb-8">
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary rounded-r-lg">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
          Types de Scénarios
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Sélectionnez un type de scénario pour pré-configurer automatiquement
          les paramètres de rendement selon différentes hypothèses de marché.
          Vous pouvez ensuite ajuster manuellement chaque paramètre.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {(Object.keys(SCENARIOS) as Scenario[]).map((scenarioKey) => {
          const scenarioInfo = SCENARIOS[scenarioKey];
          const isActive = currentScenario === scenarioKey;
          return (
            <button
              key={scenarioKey}
              onClick={() => onScenarioChange(scenarioKey)}
              className={`
                            flex-1 min-w-[150px] p-4 rounded-2xl border-2 transition-all duration-300
                            flex flex-col items-center justify-center gap-1 text-center
                            ${
                              isActive
                                ? "bg-gradient-to-br from-primary to-secondary text-white border-transparent shadow-lg scale-105"
                                : "bg-surface-container-light dark:bg-surface-container-dark border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary"
                            }
                        `}
            >
              <div className="text-2xl">
                <scenarioInfo.icon size={32} />
              </div>
              <div className="font-bold">{scenarioInfo.name}</div>
              <small className="text-xs opacity-80">
                {scenarioInfo.description}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
};
