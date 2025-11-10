
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SCENARIOS, INITIAL_PARAMS } from './constants';
import type { SimulationParams, Scenario, SimulationResults, ScenarioParams } from './types';
import { calculateSimulation } from './services/simulationService';
import { Header } from './components/Header';
import { ScenarioTabs } from './components/ScenarioTabs';
import { ParamGrid } from './components/ParamGrid';
import { ResultsSection } from './components/ResultsSection';

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentScenario, setCurrentScenario] = useState<Scenario>('ultraRealiste');
    const [scenarioParams, setScenarioParams] = useState<ScenarioParams>({
        ultraRealiste: { ...INITIAL_PARAMS },
        pessimiste: { ...INITIAL_PARAMS, ...SCENARIOS.pessimiste.overrides },
        neutre: { ...INITIAL_PARAMS, ...SCENARIOS.neutre.overrides },
    });
    const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
    const [results, setResults] = useState<SimulationResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
            return newMode;
        });
    };

    const handleScenarioChange = useCallback((scenario: Scenario) => {
        setScenarioParams(prev => ({ ...prev, [currentScenario]: params }));
        setCurrentScenario(scenario);
        setParams(scenarioParams[scenario]);
    }, [currentScenario, params, scenarioParams]);

    const handleParamChange = useCallback(<K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
        setParams(prev => ({ ...prev, [key]: value }));
    }, []);

    const debouncedCalculate = useCallback((p: SimulationParams) => {
        const timer = setTimeout(() => {
            try {
                const newResults = calculateSimulation(p);
                setResults(newResults);
            } catch (error) {
                console.error("Erreur de calcul:", error);
                setResults(null);
            } finally {
                setIsLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const cleanup = debouncedCalculate(params);
        return cleanup;
    }, [params, debouncedCalculate]);

    const allocationValues = useMemo(() => {
        const { avActif, scpiActif, immoActif, actionsActif, perActif, capitalTotal: capitalInitial } = params;
        
        const actionsAllocPct = actionsActif ? params.actionsAlloc / 100 : 0;
        const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
        const capitalLombard = params.lombardActif ? (capitalInitial * actionsAllocPct * lombardPct) : 0;
        const capitalTotalAvecLombard = capitalInitial + capitalLombard;

        const avAlloc = avActif ? params.avAlloc : 0;
        const scpiAlloc = scpiActif ? params.scpiAlloc : 0;
        const immoAlloc = immoActif ? params.immoAlloc : 0;
        const actionsAlloc = actionsActif ? params.actionsAlloc : 0;
        const perAlloc = perActif ? params.perAlloc : 0;
        const totalAlloc = avAlloc + scpiAlloc + immoAlloc + actionsAlloc + perAlloc;

        const capitalAlloue = capitalTotalAvecLombard * totalAlloc / 100;
        const capitalDisponible = capitalTotalAvecLombard - capitalAlloue;

        return { capitalTotalAvecLombard, totalAlloc, capitalAlloue, capitalDisponible };
    }, [params]);

    return (
        <div className="bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark min-h-screen">
            <div className="container mx-auto max-w-screen-2xl p-2 sm:p-4 md:p-6">
                <div className="bg-white dark:bg-gray-900/50 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm">
                    <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isLoading={isLoading} />

                    <main className="p-4 md:p-8">
                        <ScenarioTabs currentScenario={currentScenario} onScenarioChange={handleScenarioChange} />
                        <ParamGrid 
                            params={params} 
                            onParamChange={handleParamChange} 
                            allocationValues={allocationValues}
                        />
                        {results && <ResultsSection results={results} />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;
