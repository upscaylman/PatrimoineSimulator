
import React, { useState } from 'react';
import type { AnnualResult, FluxDetail, SimulationParams } from '../types';

interface ResultsTablesProps {
    resultatsAnnuels: AnnualResult[];
    detailsFlux: FluxDetail[];
    params: SimulationParams;
}

export const ResultsTables: React.FC<ResultsTablesProps> = ({ resultatsAnnuels, detailsFlux, params }) => {
    const [activeTab, setActiveTab] = useState<'patrimoine' | 'flux'>('patrimoine');

    return (
        <div className="bg-surface-container-light dark:bg-surface-container-dark p-6 rounded-3xl">
             <h3 className="text-xl font-bold mb-4 text-on-surface-light dark:text-on-surface-dark">📋 Tableau Détaillé</h3>
             <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                 <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                     <button
                         onClick={() => setActiveTab('patrimoine')}
                         className={`${activeTab === 'patrimoine' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                     >
                         💼 Patrimoine
                     </button>
                     <button
                         onClick={() => setActiveTab('flux')}
                         className={`${activeTab === 'flux' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                     >
                         💸 Détails des Flux
                     </button>
                 </nav>
             </div>
             <div className="overflow-x-auto">
                 {activeTab === 'patrimoine' && <PatrimoineTable data={resultatsAnnuels} params={params} />}
                 {activeTab === 'flux' && <FluxTable data={detailsFlux} />}
             </div>
        </div>
    );
};

const PatrimoineTable: React.FC<{ data: AnnualResult[], params: SimulationParams }> = ({ data, params }) => (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-4 py-3">Année</th>
                {params.avActif && <th scope="col" className="px-4 py-3 text-right">AV (€)</th>}
                {params.scpiActif && <th scope="col" className="px-4 py-3 text-right">SCPI (€)</th>}
                {params.immoActif && <th scope="col" className="px-4 py-3 text-right">Immo (€)</th>}
                {params.actionsActif && <th scope="col" className="px-4 py-3 text-right">S&P500 (€)</th>}
                {params.actionsActif && <th scope="col" className="px-4 py-3 text-right">Bitcoin (€)</th>}
                {params.pelActif && <th scope="col" className="px-4 py-3 text-right">PEL (€)</th>}
                {params.perActif && <th scope="col" className="px-4 py-3 text-right">PER (€)</th>}
                <th scope="col" className="px-4 py-3 text-right">Dette (€)</th>
                <th scope="col" className="px-4 py-3 text-right">Net (€)</th>
            </tr>
        </thead>
        <tbody>
            {data.map((row) => (
                <tr key={row.annee} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">An {row.annee}</td>
                    {params.avActif && <td className="px-4 py-2 text-right">{row.avCapital.toLocaleString()}</td>}
                    {params.scpiActif && <td className="px-4 py-2 text-right">{row.scpiCapital.toLocaleString()}</td>}
                    {params.immoActif && <td className="px-4 py-2 text-right">{row.immoValeur.toLocaleString()}</td>}
                    {params.actionsActif && <td className="px-4 py-2 text-right">{row.sp500.toLocaleString()}</td>}
                    {params.actionsActif && <td className="px-4 py-2 text-right">{row.bitcoin.toLocaleString()}</td>}
                    {params.pelActif && <td className="px-4 py-2 text-right">{row.pelSolde.toLocaleString()}</td>}
                    {params.perActif && <td className="px-4 py-2 text-right">{row.perSolde.toLocaleString()}</td>}
                    <td className="px-4 py-2 text-right text-red-500">{row.detteLombard.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-bold text-green-500">{row.patrimoineNet.toLocaleString()}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const FluxTable: React.FC<{ data: FluxDetail[] }> = ({ data }) => (
     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-4 py-3">Année</th>
                <th scope="col" className="px-4 py-3 text-right">🏠 Loyers</th>
                <th scope="col" className="px-4 py-3 text-right">🏢 Div. SCPI</th>
                <th scope="col" className="px-4 py-3 text-right">💼 Int. AV</th>
                <th scope="col" className="px-4 py-3 text-right">📈 Gains S&P500</th>
                <th scope="col" className="px-4 py-3 text-right"> Gains BTC</th>
                <th scope="col" className="px-4 py-3 text-right">🏦 Int. Lombard</th>
                <th scope="col" className="px-4 py-3 text-right">Remb. Lombard</th>
            </tr>
        </thead>
        <tbody>
             {data.map((row) => (
                <tr key={row.annee} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">An {row.annee}</td>
                    <td className="px-4 py-2 text-right text-green-500">{row.loyersBruts.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-green-500">{row.dividendesSCPI.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-green-500">{row.interetsAV.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-green-500">{row.gainsSP500.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-green-500">{row.gainsBitcoin.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-red-500">-{row.interetsLombard.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-red-500">-{row.remboursementLombard.toLocaleString()}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
