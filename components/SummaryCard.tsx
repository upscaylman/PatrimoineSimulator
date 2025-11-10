
import React from 'react';

interface SummaryCardProps {
    title: string;
    value: number | string;
    isCurrency?: boolean;
    isPercent?: boolean;
    subtext?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, isCurrency, isPercent, subtext }) => {
    const formattedValue = typeof value === 'number' 
        ? isCurrency 
            ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) 
            : value.toLocaleString('fr-FR')
        : value;

    return (
        <div className="bg-gradient-to-br from-primary/80 to-secondary/80 text-white p-6 rounded-3xl shadow-lg">
            <h3 className="text-sm font-semibold opacity-80 mb-2">{title}</h3>
            <p className="text-3xl font-bold">
                {formattedValue}{isPercent && '%'}
            </p>
            {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
        </div>
    );
};
