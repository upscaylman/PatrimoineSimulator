
import React from 'react';
import { SCENARIOS } from '../constants';
import type { Scenario } from '../types';

interface ScenarioTabsProps {
    currentScenario: Scenario;
    onScenarioChange: (scenario: Scenario) => void;
}

export const ScenarioTabs: React.FC<ScenarioTabsProps> = ({ currentScenario, onScenarioChange }) => {
    return (
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
            {(Object.keys(SCENARIOS) as Scenario[]).map(scenarioKey => {
                const scenarioInfo = SCENARIOS[scenarioKey];
                const isActive = currentScenario === scenarioKey;
                return (
                    <button
                        key={scenarioKey}
                        onClick={() => onScenarioChange(scenarioKey)}
                        className={`
                            flex-1 min-w-[150px] p-4 rounded-2xl border-2 transition-all duration-300
                            flex flex-col items-center justify-center gap-1 text-center
                            ${isActive
                                ? 'bg-gradient-to-br from-primary to-secondary text-white border-transparent shadow-lg scale-105'
                                : 'bg-surface-container-light dark:bg-surface-container-dark border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                            }
                        `}
                    >
                        <div className="text-2xl">{scenarioInfo.icon}</div>
                        <div className="font-bold">{scenarioInfo.name}</div>
                        <small className="text-xs opacity-80">{scenarioInfo.description}</small>
                    </button>
                );
            })}
        </div>
    );
};
