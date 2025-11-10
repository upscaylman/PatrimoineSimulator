import React from "react";
import { MdWarning } from "react-icons/md";
import { PLAFONDS, SCPI_DATA } from "../constants";
import type { SimulationParams, Synthesis } from "../types";

interface RisksProps {
  synthese: Synthesis;
  params: SimulationParams;
}

export const Risks: React.FC<RisksProps> = ({ synthese, params }) => {
  const listItems: string[] = [];

  if (params.avActif) {
    const tauxNet = (params.avRendement - params.avFraisGestion).toFixed(2);
    const renteAnnuelle = params.rente * 12;
    listItems.push(
      `<strong>Assurance Vie :</strong> Rente ${renteAnnuelle.toLocaleString()} €/an avec rendement net ${tauxNet}% • Risque épuisement du capital si rente > intérêts`
    );
  }

  if (params.scpiActif) {
    const scpiData = SCPI_DATA[params.scpiProduit];
    listItems.push(
      `<strong>SCPI ${scpiData.nom} :</strong> Risque ${scpiData.risque} • TOF ${scpiData.tof}% (risque vacance locative) • Frais gestion ${scpiData.fraisGestion}% annuels • Liquidité faible (délai revente 3-12 mois)`
    );
  }

  if (params.immoActif) {
    listItems.push(
      `<strong>Immobilier LMNP :</strong> Risque vacance locative • Impayés • Travaux imprévus • Fiscalité PV immo (abattements après 6 ans)`
    );
  }

  if (params.actionsActif) {
    const actionsAllocPct = params.actionsAlloc / 100;
    const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
    const capitalLombard = params.lombardActif
      ? params.capitalTotal * actionsAllocPct * lombardPct
      : 0;
    const capitalTotalAvecLombard = params.capitalTotal + capitalLombard;
    const montantActions = capitalTotalAvecLombard * actionsAllocPct;
    const pctPEA =
      (Math.min(montantActions, PLAFONDS.pea.limite) / montantActions) * 100;

    listItems.push(
      `<strong>Actions :</strong> PEA plafond 150k€ (${pctPEA.toFixed(
        0
      )}% de votre allocation) • Blocage 5 ans pour optimisation fiscale • CTO flat tax 30%`
    );
    listItems.push(
      `<strong>Bitcoin :</strong> ${(100 - params.sp500).toFixed(
        0
      )}% du portefeuille • Volatilité extrême (corrections -50% à -80%) • Risque réglementaire`
    );
    listItems.push(
      `<strong>S&P500 :</strong> Risque krach boursier (-30% à -50%) • Risque de change USD/EUR`
    );
  }

  if (params.lombardActif && synthese.montantLombardEmprunte > 0) {
    listItems.push(
      `<strong>Crédit Lombard :</strong> Appel de marge si portefeuille Actions baisse > 30% • Risque vente forcée titres • Remboursement obligatoire sur ${
        params.lombardDuree
      } ans • Dette non remboursée : ${synthese.detteFinal.toLocaleString()} €`
    );
  }

  if (params.perActif) {
    const actionsAllocPct = params.actionsAlloc / 100;
    const lombardPct = params.lombardActif ? params.lombardAlloc / 100 : 0;
    const capitalLombard = params.lombardActif
      ? params.capitalTotal * actionsAllocPct * lombardPct
      : 0;
    const capitalTotalAvecLombard = params.capitalTotal + capitalLombard;
    const versementAnnuel = Math.round(
      (capitalTotalAvecLombard * (params.perAlloc / 100)) / 8
    );
    if (versementAnnuel > PLAFONDS.per.limite) {
      listItems.push(
        `<strong>PER :</strong> Versement annuel ${versementAnnuel.toLocaleString()} € dépasse le plafond ${PLAFONDS.per.limite.toLocaleString()} €/an • Blocage jusqu'à 62 ans • Fiscalité sortie au barème IR`
      );
    } else {
      listItems.push(
        `<strong>PER :</strong> Blocage jusqu'à 62 ans (sauf cas exceptionnels) • Fiscalité sortie au barème IR • Risque perte en capital sur supports UC`
      );
    }
  }

  if (params.pelActif) {
    listItems.push(
      `<strong>PEL :</strong> Plafond 61 200 € • Tout retrait = clôture définitive • Rendement faible (${params.pelTaux.toFixed(
        2
      )}%)`
    );
  }

  listItems.push(
    `<strong>Fiscalité évolutive :</strong> Flat tax peut passer de 30% à 33-36% • Abattements PV immo peuvent être réduits • TMI PER peut évoluer • Plafonds peuvent changer`
  );

  if (params.inflationActif) {
    listItems.push(
      `<strong>Inflation :</strong> Érosion pouvoir d'achat ${params.inflationTaux.toFixed(
        1
      )}%/an • Rente AV non revalorisée • Impact cumulé sur 8 ans : -${
        synthese.inflationCumulee
      }%`
    );
  } else {
    listItems.push(
      `<strong>Inflation :</strong> Non prise en compte • Érosion réelle pouvoir d'achat si inflation > 0% • Rente AV non revalorisée`
    );
  }

  if (synthese.capitalNonAlloue > 0) {
    const capitalNonAlloueReel = params.inflationActif
      ? Math.round(
          synthese.capitalNonAlloue /
            Math.pow(1 + params.inflationTaux / 100, 8)
        )
      : synthese.capitalNonAlloue;
    const perteInflation = params.inflationActif
      ? Math.round(synthese.capitalNonAlloue - capitalNonAlloueReel)
      : 0;
    listItems.push(
      `<strong>Capital non investi :</strong> ${synthese.capitalNonAlloue.toLocaleString()} € en cash • ${
        params.inflationActif
          ? `Perte réelle de ${perteInflation.toLocaleString()} € sur 8 ans (inflation ${
              synthese.inflationCumulee
            }%)`
          : "Aucun rendement"
      } • Recommandation : allouer 100% du capital`
    );
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200 flex items-center gap-2">
        <MdWarning size={20} />
        Risques Principaux
      </h3>
      <ul className="space-y-3 list-disc list-inside text-sm text-red-700 dark:text-red-300">
        {listItems.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </div>
  );
};
