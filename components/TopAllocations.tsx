import React from "react";
import {
  MdBalance,
  MdEmojiEvents,
  MdRocketLaunch,
  MdShield,
} from "react-icons/md";
import { FISCALITE } from "../constants";
import type { SimulationParams } from "../types";

interface TopAllocationsProps {
  params: SimulationParams;
}

export const TopAllocations: React.FC<TopAllocationsProps> = ({ params }) => {
  if (!params.actionsActif) {
    return (
      <div className="mt-8">
        <p className="text-center py-5 text-gray-600 dark:text-gray-400">
          Module Actions désactivé
        </p>
      </div>
    );
  }

  const allocations = [
    { sp500: 80, bitcoin: 20, nom: "Prudente", icon: MdShield },
    { sp500: 60, bitcoin: 40, nom: "Équilibrée", icon: MdBalance },
    { sp500: 40, bitcoin: 60, nom: "Agressive", icon: MdRocketLaunch },
  ];

  // Calcul du capital total avec Lombard si activé
  const actionsAllocPct = params.actionsAlloc / 100;
  const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
  const capitalLombard = params.lombardActif
    ? params.capitalTotal * actionsAllocPct * lombardPct
    : 0;
  const capitalTotalAvecLombard = params.capitalTotal + capitalLombard;
  const capitalActions = capitalTotalAvecLombard * actionsAllocPct;

  const DUREE = 8;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-on-surface-light dark:text-on-surface-dark flex items-center gap-2">
        <MdEmojiEvents className="w-6 h-6" />
        Top 3 des Meilleures Allocations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allocations.map((alloc) => {
          const sp500Initial = capitalActions * (alloc.sp500 / 100);
          const bitcoinInitial = capitalActions * (alloc.bitcoin / 100);

          const sp500Final =
            sp500Initial * Math.pow(1 + params.sp500Rdt / 100, DUREE);
          const bitcoinFinal =
            bitcoinInitial * Math.pow(1 + params.bitcoinRdt / 100, DUREE);

          const capitalFinal = sp500Final + bitcoinFinal;
          const gainBourse = capitalFinal - capitalActions;
          const rendement =
            capitalActions > 0
              ? ((gainBourse / capitalActions / DUREE) * 100).toFixed(1)
              : "0.0";

          const plusValueSP500 = sp500Final - sp500Initial;
          const plusValueBitcoin = bitcoinFinal - bitcoinInitial;

          const fiscaliteSP500 = plusValueSP500 * FISCALITE.psSeul;
          const fiscaliteBTC = plusValueBitcoin * FISCALITE.flatTax;
          const gainNet = gainBourse - fiscaliteSP500 - fiscaliteBTC;

          return (
            <div
              key={alloc.nom}
              className="bg-white dark:bg-gray-800 border-2 border-primary rounded-xl p-6 shadow-lg"
            >
              <h4 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                <alloc.icon size={20} />
                Allocation {alloc.nom}
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>S&P500 :</strong> {alloc.sp500}% (
                  {Math.round(sp500Initial).toLocaleString()} €)
                </p>
                <p>
                  <strong>Bitcoin :</strong> {alloc.bitcoin}% (
                  {Math.round(bitcoinInitial).toLocaleString()} €)
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-green-600 dark:text-green-400">
                    <strong>Gain brut estimé :</strong> +
                    {Math.round(gainBourse).toLocaleString()} €
                  </p>
                  <p className="text-red-500 dark:text-red-400">
                    <strong>Fiscalité :</strong> -
                    {Math.round(fiscaliteSP500 + fiscaliteBTC).toLocaleString()}{" "}
                    € (PEA {Math.round(fiscaliteSP500).toLocaleString()} € + CTO{" "}
                    {Math.round(fiscaliteBTC).toLocaleString()} €)
                  </p>
                  <p className="text-primary font-bold text-lg">
                    <strong>Gain net :</strong> +
                    {Math.round(gainNet).toLocaleString()} €
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Rendement annuel :</strong> {rendement}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 italic">
        * Comparaison basée sur les rendements actuels. Les performances passées
        ne préjugent pas des performances futures.
      </p>
    </div>
  );
};
