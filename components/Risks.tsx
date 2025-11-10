
import React from 'react';
import type { Synthesis, SimulationParams } from '../types';

interface RisksProps {
    synthese: Synthesis;
    params: SimulationParams;
}

export const Risks: React.FC<RisksProps> = ({ synthese, params }) => {
    const listItems = [];

    if (params.actionsActif) {
        listItems.push(`Actions: Volatilité du S&P500 et extrême volatilité du Bitcoin (${(100 - params.sp500).toFixed(0)}% de l'allocation actions).`);
    }

    if (params.immoActif) {
        listItems.push(`Immobilier: Risque de vacance locative, impayés, et variations du marché immobilier.`);
    }

    if (params.lombardActif && synthese.montantLombardEmprunte > 0) {
        listItems.push(`Crédit Lombard: Appel de marge si la valeur du portefeuille Actions baisse significativement.`);
    }
    
    if (params.perActif) {
        listItems.push(`PER: Capital bloqué jusqu'à la retraite (sauf cas exceptionnels), fiscalité à la sortie.`);
    }

    if (params.inflationActif) {
        listItems.push(`Inflation: Érosion du pouvoir d'achat de ${params.inflationTaux}%/an, impactant la valeur réelle du patrimoine et des rentes.`);
    } else {
        listItems.push(`Inflation: Non prise en compte, les résultats nominaux peuvent masquer une perte de pouvoir d'achat.`);
    }
    
    if (synthese.detteFinal > 0) {
        listItems.push(`Dette: ${synthese.detteFinal.toLocaleString()} € de dette Lombard restante à la fin de la simulation.`);
    }

    return (
        <div className="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200">⚠️ Risques Principaux</h3>
            <ul className="space-y-3 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                {listItems.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );
};
