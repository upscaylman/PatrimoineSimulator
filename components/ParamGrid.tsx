import React, { useMemo } from "react";
import {
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdBusiness,
  MdBusinessCenter,
  MdCheckCircle,
  MdError,
  MdGpsFixed,
  MdHome,
  MdSchedule,
  MdSettings,
  MdShowChart,
  MdWarning,
} from "react-icons/md";
import { PLAFONDS, SCPI_DATA } from "../constants";
import type { SimulationParams } from "../types";
import { ParamCard } from "./ParamCard";
import { Select } from "./ui/Select";
import { Slider } from "./ui/Slider";
import { Switch } from "./ui/Switch";
import { TooltipIcon } from "./ui/TooltipIcon";

interface ParamGridProps {
  params: SimulationParams;
  onParamChange: <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K]
  ) => void;
  allocationValues: {
    capitalTotalAvecLombard: number;
    totalAlloc: number;
    capitalAlloue: number;
    capitalDisponible: number;
  };
}

const InputGroup: React.FC<{
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, tooltip, children, className = "" }) => (
  <div className={`mb-5 ${className}`}>
    <label className="block mb-2 font-bold text-sm text-on-surface-light dark:text-on-surface-dark flex items-center gap-2">
      {label}
      {tooltip && <TooltipIcon text={tooltip} />}
    </label>
    {children}
  </div>
);

const NumberInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { unit: string }
> = ({ unit, ...props }) => (
  <div className="flex items-center gap-3">
    <input
      type="number"
      {...props}
      className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-500 rounded-xl bg-white dark:bg-gray-800/80 text-base font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm hover:shadow-md"
    />
    <span className="font-bold text-base text-on-surface-variant-light dark:text-on-surface-variant-dark min-w-[2rem]">
      {unit}
    </span>
  </div>
);

const AllocationDisplay: React.FC<{
  label: string;
  value: number;
  amount: number;
  onSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sliderValue: number;
  max?: number;
}> = ({ label, value, amount, onSliderChange, sliderValue, max = 100 }) => (
  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-600">
    <div className="flex justify-between items-center mb-3">
      <label className="font-bold text-base text-on-surface-light dark:text-on-surface-dark">
        {label}
      </label>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-primary">
          {value.toFixed(1)}%
        </span>
        <span className="text-sm font-medium text-on-surface-variant-light dark:text-on-surface-variant-dark">
          ({Math.round(amount).toLocaleString()} €)
        </span>
      </div>
    </div>
    <Slider
      value={sliderValue}
      onChange={onSliderChange}
      min="0"
      max={max}
      step="0.5"
    />
    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-300">
      <span>0%</span>
      <span>{max}%</span>
    </div>
  </div>
);

export const ParamGrid: React.FC<ParamGridProps> = ({
  params,
  onParamChange,
  allocationValues,
}) => {
  const {
    capitalTotalAvecLombard,
    totalAlloc,
    capitalAlloue,
    capitalDisponible,
  } = allocationValues;

  const allocationStatus = useMemo(() => {
    if (Math.abs(totalAlloc - 100) < 0.1)
      return {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        text: `Allocation : ${totalAlloc.toFixed(1)}%`,
        icon: (
          <span className="inline-flex items-center mr-1">
            <MdCheckCircle size={16} />
          </span>
        ),
      };
    if (totalAlloc < 100)
      return {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        text: `Il reste ${(100 - totalAlloc).toFixed(1)}% à allouer`,
        icon: (
          <span className="inline-flex items-center mr-1">
            <MdWarning size={16} />
          </span>
        ),
      };
    return {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      text: `Allocation dépasse de ${(totalAlloc - 100).toFixed(1)}%`,
      icon: (
        <span className="inline-flex items-center mr-1">
          <MdError size={16} />
        </span>
      ),
    };
  }, [totalAlloc]);

  const handleAllocationSliderChange =
    (key: keyof SimulationParams, currentValue: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      const diff = newValue - currentValue;
      const remainder = 100 - totalAlloc;
      onParamChange(key, currentValue + Math.min(diff, remainder));
    };

  const isLombardAvailable = params.actionsActif && params.actionsAlloc > 0;

  // Plafonds check
  const montantActions = capitalTotalAvecLombard * (params.actionsAlloc / 100);
  const plafondPEA = PLAFONDS.pea.limite;
  let peaWarning: { type: string; message: string } | null = null;
  if (params.actionsActif) {
    if (montantActions > plafondPEA) {
      peaWarning = {
        type: "warning",
        message: `Dépassement PEA. ${plafondPEA.toLocaleString()} € en PEA, le reste en CTO.`,
      };
    } else if (montantActions > plafondPEA * 0.9) {
      peaWarning = {
        type: "alert",
        message: `Proche du plafond PEA. Reste: ${(
          plafondPEA - montantActions
        ).toLocaleString()} €.`,
      };
    } else {
      peaWarning = {
        type: "ok",
        message: `${((montantActions / plafondPEA) * 100).toFixed(
          0
        )}% du plafond PEA utilisé.`,
      };
    }
  }

  const versementAnnuelPER =
    (capitalTotalAvecLombard * (params.perAlloc / 100)) / 8;
  const plafondPER = PLAFONDS.per.limite;
  let perWarning: { type: string; message: string } | null = null;
  if (params.perActif) {
    if (versementAnnuelPER > plafondPER) {
      perWarning = {
        type: "error",
        message: `Dépassement du plafond annuel PER de ${(
          versementAnnuelPER - plafondPER
        ).toLocaleString()} €.`,
      };
    } else {
      perWarning = {
        type: "ok",
        message: `Versement annuel PER: ${versementAnnuelPER.toLocaleString()} €.`,
      };
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {/* Capital Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdAccountBalanceWallet size={20} />
            </span>
            Capital à Investir
          </>
        }
        color="from-blue-500 via-indigo-500 to-purple-600"
      >
        <InputGroup
          label="Capital initial"
          tooltip="Votre capital de départ à investir. Le crédit Lombard s'ajoutera à ce montant pour augmenter votre capacité d'investissement."
        >
          <NumberInput
            unit="€"
            value={params.capitalTotal}
            onChange={(e) =>
              onParamChange("capitalTotal", parseFloat(e.target.value))
            }
            min="0"
            step="1000"
          />
        </InputGroup>

        <div className="my-5 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <label
              htmlFor="versement-periodique-actif"
              className="font-bold text-sm text-on-surface-light dark:text-on-surface-dark flex items-center gap-2"
            >
              <MdSchedule className="w-5 h-5 text-primary" />
              Versements périodiques
            </label>
            <Switch
              id="versement-periodique-actif"
              checked={params.versementPeriodiqueActif}
              onChange={(e) =>
                onParamChange("versementPeriodiqueActif", e.target.checked)
              }
            />
          </div>
          <div
            className={`transition-opacity duration-300 space-y-4 ${
              params.versementPeriodiqueActif
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div>
              <label className="block mb-2 font-semibold text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark">
                Fréquence
              </label>
              <Select
                value={params.versementFrequence}
                onChange={(e) =>
                  onParamChange(
                    "versementFrequence",
                    e.target.value as "mensuel" | "hebdomadaire"
                  )
                }
              >
                <option value="mensuel">Mensuel</option>
                <option value="hebdomadaire">Hebdomadaire</option>
              </Select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark">
                Montant par{" "}
                {params.versementFrequence === "mensuel" ? "mois" : "semaine"}
              </label>
              <NumberInput
                unit="€"
                value={params.versementMontant}
                onChange={(e) =>
                  onParamChange(
                    "versementMontant",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="50"
              />
            </div>
            {params.versementPeriodiqueActif && params.versementMontant > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark space-y-1">
                  <div className="flex justify-between">
                    <span>Versement annuel :</span>
                    <span className="font-bold text-on-surface-light dark:text-on-surface-dark">
                      {(params.versementFrequence === "mensuel"
                        ? params.versementMontant * 12
                        : params.versementMontant * 52.18
                      ).toLocaleString()}{" "}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total sur 8 ans :</span>
                    <span className="font-bold text-primary">
                      {(
                        (params.versementFrequence === "mensuel"
                          ? params.versementMontant * 12
                          : params.versementMontant * 52.18) * 8
                      ).toLocaleString()}{" "}
                      €
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {params.lombardActif && (
          <div className="my-4 p-3 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="font-semibold text-blue-800 dark:text-blue-200 text-sm flex items-center gap-1">
              <MdAccountBalance className="w-4 h-4" />+ Crédit Lombard
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              {Math.round(
                capitalTotalAvecLombard -
                  params.capitalTotal -
                  (params.versementPeriodiqueActif
                    ? (params.versementFrequence === "mensuel"
                        ? params.versementMontant * 12
                        : params.versementMontant * 52.18) * 8
                    : 0)
              ).toLocaleString()}{" "}
              € (année {params.lombardAnnee})
            </div>
          </div>
        )}

        <div className="border-t-2 border-primary/50 pt-3 mt-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center font-semibold text-on-surface-light dark:text-on-surface-dark">
              <span>Capital total disponible :</span>
              <span className="text-lg text-primary font-bold">
                {Math.round(capitalTotalAvecLombard).toLocaleString()} €
              </span>
            </div>
            {params.versementPeriodiqueActif && params.versementMontant > 0 && (
              <div className="text-xs text-on-surface-variant-light dark:text-on-surface-variant-dark flex justify-between">
                <span>Dont versements futurs (8 ans) :</span>
                <span className="font-semibold">
                  {(
                    (params.versementFrequence === "mensuel"
                      ? params.versementMontant * 12
                      : params.versementMontant * 52.18) * 8
                  ).toLocaleString()}{" "}
                  €
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex items-center justify-between flex-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <label
              htmlFor="inflation-actif"
              className="font-bold text-sm flex-1 min-w-0"
            >
              <span className="truncate">Prendre en compte l'inflation</span>
            </label>
            <Switch
              id="inflation-actif"
              checked={params.inflationActif}
              onChange={(e) =>
                onParamChange("inflationActif", e.target.checked)
              }
            />
          </div>
          <TooltipIcon text="Érosion du pouvoir d'achat. Activez pour voir la valeur réelle de votre patrimoine." />
        </div>

        <div
          className={`transition-opacity duration-300 ${
            params.inflationActif
              ? "opacity-100"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <InputGroup label="Taux d'inflation annuel">
            <NumberInput
              unit="%"
              value={params.inflationTaux}
              onChange={(e) =>
                onParamChange("inflationTaux", parseFloat(e.target.value))
              }
              min="0"
              max="10"
              step="0.1"
            />
          </InputGroup>
        </div>

        <div className="mt-6 space-y-3 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-on-surface-variant-light dark:text-on-surface-variant-dark">
              Alloué :
            </span>
            <span className="text-base font-bold text-on-surface-light dark:text-on-surface-dark">
              {capitalAlloue.toLocaleString()} €
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-on-surface-variant-light dark:text-on-surface-variant-dark">
              Disponible :
            </span>
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              {capitalDisponible.toLocaleString()} €
            </span>
          </div>
          <div
            className={`text-center p-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${allocationStatus.color}`}
          >
            {allocationStatus.icon}
            {allocationStatus.text}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * Capital initial + versements périodiques + crédit Lombard = capital
          total • Objectif : allocation 100% • Inflation : érosion pouvoir
          d'achat • Versements alloués selon les pourcentages définis
        </div>
      </ParamCard>

      {/* Assurance Vie Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdBusiness size={20} />
            </span>
            Assurance Vie
          </>
        }
        color="from-emerald-500 via-teal-500 to-cyan-500"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="av-actif" className="font-bold text-sm">
            Activer l'assurance vie
          </label>
          <Switch
            id="av-actif"
            checked={params.avActif}
            onChange={(e) => onParamChange("avActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.avActif ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <AllocationDisplay
            label="Allocation"
            value={params.avAlloc}
            amount={(capitalTotalAvecLombard * params.avAlloc) / 100}
            onSliderChange={handleAllocationSliderChange(
              "avAlloc",
              params.avAlloc
            )}
            sliderValue={params.avAlloc}
          />
          <InputGroup
            label="Rendement fonds euros (brut/an)"
            tooltip="Rendement annuel avant frais et fiscalité."
          >
            <NumberInput
              unit="%"
              value={params.avRendement}
              onChange={(e) =>
                onParamChange("avRendement", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup
            label="Rente mensuelle (brut)"
            tooltip="Montant brut retiré chaque mois."
          >
            <NumberInput
              unit="€"
              value={params.rente}
              onChange={(e) =>
                onParamChange("rente", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Frais d'entrée">
            <NumberInput
              unit="%"
              value={params.avFrais}
              onChange={(e) =>
                onParamChange("avFrais", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Frais de gestion (annuels)">
            <NumberInput
              unit="%"
              value={params.avFraisGestion}
              onChange={(e) =>
                onParamChange("avFraisGestion", parseFloat(e.target.value))
              }
            />
          </InputGroup>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * Flat tax 2025 : 30% (12,8% IR + 17,2% PS) • Aucun plafond légal •
          Source :{" "}
          <a
            href="https://www.service-public.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Service-Public.fr
          </a>
        </div>
      </ParamCard>

      {/* SCPI Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdBusinessCenter size={20} />
            </span>
            SCPI
          </>
        }
        color="from-amber-500 via-orange-500 to-yellow-500"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="scpi-actif" className="font-bold text-sm">
            Activer la SCPI
          </label>
          <Switch
            id="scpi-actif"
            checked={params.scpiActif}
            onChange={(e) => onParamChange("scpiActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.scpiActif ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <AllocationDisplay
            label="Allocation"
            value={params.scpiAlloc}
            amount={(capitalTotalAvecLombard * params.scpiAlloc) / 100}
            onSliderChange={handleAllocationSliderChange(
              "scpiAlloc",
              params.scpiAlloc
            )}
            sliderValue={params.scpiAlloc}
          />
          <InputGroup
            label="Produit SCPI"
            tooltip="TOF = Taux d'Occupation Financier (100% - vacance locative)."
          >
            <Select
              value={params.scpiProduit}
              onChange={(e) => onParamChange("scpiProduit", e.target.value)}
            >
              {Object.keys(SCPI_DATA).map((key) => (
                <option key={key} value={key}>
                  {SCPI_DATA[key].nom} ({SCPI_DATA[key].tauxBrut}% -{" "}
                  {SCPI_DATA[key].risque})
                </option>
              ))}
            </Select>
          </InputGroup>
          <div className="text-xs p-3 rounded-lg bg-surface-container-light dark:bg-surface-container-dark text-on-surface-variant-light dark:text-on-surface-variant-dark">
            <strong>{SCPI_DATA[params.scpiProduit].nom}</strong>
            <br />
            Taux: {SCPI_DATA[params.scpiProduit].tauxBrut}% | TOF:{" "}
            {SCPI_DATA[params.scpiProduit].tof}% | Cap:{" "}
            {SCPI_DATA[params.scpiProduit].capitalisation}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * SCPI via AV • Aucun plafond • Dividendes → PEL ou AV • Source :{" "}
          <a
            href={SCPI_DATA[params.scpiProduit].sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {SCPI_DATA[params.scpiProduit].source}
          </a>
        </div>
      </ParamCard>

      {/* Immobilier Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdHome size={20} />
            </span>
            Immobilier LMNP
          </>
        }
        color="from-rose-500 via-red-500 to-pink-600"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="immo-actif" className="font-bold text-sm">
            Activer l'immobilier
          </label>
          <Switch
            id="immo-actif"
            checked={params.immoActif}
            onChange={(e) => onParamChange("immoActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.immoActif ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <AllocationDisplay
            label="Allocation"
            value={params.immoAlloc}
            amount={(capitalTotalAvecLombard * params.immoAlloc) / 100}
            onSliderChange={handleAllocationSliderChange(
              "immoAlloc",
              params.immoAlloc
            )}
            sliderValue={params.immoAlloc}
          />
          <InputGroup label="Rendement locatif (brut/an)">
            <NumberInput
              unit="%"
              value={params.immoRdt}
              onChange={(e) =>
                onParamChange("immoRdt", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Plus-value annuelle">
            <NumberInput
              unit="%"
              value={params.immoPV}
              onChange={(e) =>
                onParamChange("immoPV", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Taxe foncière (€/an)">
            <NumberInput
              unit="€"
              value={params.taxeFonciere}
              onChange={(e) =>
                onParamChange("taxeFonciere", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <div className="flex items-center justify-between mt-5 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50">
            <label
              htmlFor="vente-immo"
              className="font-bold text-sm text-red-800 dark:text-red-200"
            >
              Vendre en année 8
            </label>
            <Switch
              id="vente-immo"
              checked={params.venteImmo}
              onChange={(e) => onParamChange("venteImmo", e.target.checked)}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * LMNP micro-BIC : abattement 50% • Aucun plafond • PV immo : 6%/an IR
          (années 6-21) • Source :{" "}
          <a
            href="https://www.service-public.fr/particuliers/vosdroits/F10864"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Impots.gouv.fr
          </a>
        </div>
      </ParamCard>

      {/* Actions Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdShowChart size={20} />
            </span>
            Allocation Actions
          </>
        }
        color="from-amber-400 via-yellow-500 to-orange-500"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="actions-actif" className="font-bold text-sm">
            Activer les actions
          </label>
          <Switch
            id="actions-actif"
            checked={params.actionsActif}
            onChange={(e) => onParamChange("actionsActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.actionsActif
              ? "opacity-100"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <AllocationDisplay
            label="Allocation"
            value={params.actionsAlloc}
            amount={(capitalTotalAvecLombard * params.actionsAlloc) / 100}
            onSliderChange={handleAllocationSliderChange(
              "actionsAlloc",
              params.actionsAlloc
            )}
            sliderValue={params.actionsAlloc}
          />
          <InputGroup label="S&P500 (PEA)">
            <NumberInput
              unit="%"
              value={params.sp500}
              onChange={(e) =>
                onParamChange("sp500", parseFloat(e.target.value))
              }
              min="0"
              max="100"
            />
          </InputGroup>
          <InputGroup label="Rendement S&P500 (brut/an)">
            <NumberInput
              unit="%"
              value={params.sp500Rdt}
              onChange={(e) =>
                onParamChange("sp500Rdt", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup
            label={`Bitcoin (CTO) : ${(100 - params.sp500).toFixed(2)}%`}
          >
            <NumberInput
              unit="%"
              value={params.bitcoinRdt}
              onChange={(e) =>
                onParamChange("bitcoinRdt", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          {peaWarning && (
            <div
              className={`mt-2 p-2 text-xs rounded-md bg-${
                peaWarning.type === "ok"
                  ? "green"
                  : peaWarning.type === "alert"
                  ? "yellow"
                  : "red"
              }-100 text-${
                peaWarning.type === "ok"
                  ? "green"
                  : peaWarning.type === "alert"
                  ? "yellow"
                  : "red"
              }-800`}
            >
              {peaWarning.message}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * PEA plafond : 150 000 € • Après 5 ans : PS 17,2% • CTO illimité :
          flat tax 30% • Source :{" "}
          <a
            href="https://www.service-public.fr/particuliers/vosdroits/F2385"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Service-Public.fr
          </a>
        </div>
      </ParamCard>

      {/* PER Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdGpsFixed size={20} />
            </span>
            PER
          </>
        }
        color="from-violet-500 via-purple-600 to-indigo-600"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="per-actif" className="font-bold text-sm">
            Activer le PER
          </label>
          <Switch
            id="per-actif"
            checked={params.perActif}
            onChange={(e) => onParamChange("perActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.perActif ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <AllocationDisplay
            label="Allocation"
            value={params.perAlloc}
            amount={(capitalTotalAvecLombard * params.perAlloc) / 100}
            onSliderChange={handleAllocationSliderChange(
              "perAlloc",
              params.perAlloc
            )}
            sliderValue={params.perAlloc}
          />
          <InputGroup label="Rendement PER (brut/an)">
            <NumberInput
              unit="%"
              value={params.perRendement}
              onChange={(e) =>
                onParamChange("perRendement", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Frais de gestion (annuels)">
            <NumberInput
              unit="%"
              value={params.perFrais}
              onChange={(e) =>
                onParamChange("perFrais", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="TMI (Tranche Marginale Impôt)">
            <NumberInput
              unit="%"
              value={params.perTMI}
              onChange={(e) =>
                onParamChange("perTMI", parseFloat(e.target.value))
              }
              step="1"
            />
          </InputGroup>
          {perWarning && (
            <div
              className={`mt-2 p-2 text-xs rounded-md bg-${
                perWarning.type === "ok" ? "green" : "red"
              }-100 text-${perWarning.type === "ok" ? "green" : "red"}-800`}
            >
              {perWarning.message}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * PER 2025 : plafond ~33 000 €/an (10% revenus) • Déduction IR
          immédiate • Bloqué jusqu'à 62 ans • Source :{" "}
          <a
            href="https://www.service-public.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Service-Public.fr
          </a>
        </div>
      </ParamCard>

      {/* Crédit Lombard Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdAccountBalance size={20} />
            </span>
            Crédit Lombard
          </>
        }
        color="from-blue-400 via-cyan-500 to-blue-600"
      >
        <div
          className={`flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 ${
            !isLombardAvailable && "opacity-60"
          }`}
        >
          <label
            htmlFor="lombard-actif"
            className={`font-bold text-sm transition-colors ${
              !isLombardAvailable && "text-gray-400 dark:text-gray-400"
            }`}
          >
            Activer le crédit Lombard
          </label>
          <Switch
            id="lombard-actif"
            checked={params.lombardActif}
            onChange={(e) => onParamChange("lombardActif", e.target.checked)}
            disabled={!isLombardAvailable}
          />
        </div>
        {!isLombardAvailable && (
          <div className="p-2 text-xs rounded-md bg-yellow-100 text-yellow-800 mb-2">
            Le crédit Lombard nécessite une allocation Actions {">"} 0.
          </div>
        )}
        <div
          className={`transition-opacity duration-300 ${
            params.lombardActif && isLombardAvailable
              ? "opacity-100"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-3">
              <label className="font-bold text-base text-on-surface-light dark:text-on-surface-dark flex items-center gap-2">
                % à emprunter sur Actions
                <TooltipIcon text="LTV (Loan-to-Value) : pourcentage de votre portefeuille Actions que vous pouvez emprunter. Ex : 50% de 100 000€ en Actions = 50 000€ empruntés. Max généralement 80%." />
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">
                  {params.lombardAlloc.toFixed(1)}%
                </span>
              </div>
            </div>
            <Slider
              value={params.lombardAlloc}
              onChange={(e) =>
                onParamChange("lombardAlloc", parseFloat(e.target.value))
              }
              min="0"
              max="80"
              step="0.5"
            />
          </div>
          <InputGroup label="Année de contraction">
            <Select
              value={params.lombardAnnee}
              onChange={(e) =>
                onParamChange("lombardAnnee", parseInt(e.target.value))
              }
            >
              {[...Array(9).keys()].map((i) => (
                <option key={i} value={i}>
                  Année {i}
                </option>
              ))}
            </Select>
          </InputGroup>
          <InputGroup label="Taux Lombard (brut/an)">
            <NumberInput
              unit="%"
              value={params.lombardTaux}
              onChange={(e) =>
                onParamChange("lombardTaux", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Durée du crédit">
            <Select
              value={params.lombardDuree}
              onChange={(e) =>
                onParamChange("lombardDuree", parseInt(e.target.value))
              }
            >
              <option value="3">3 ans</option>
              <option value="5">5 ans</option>
            </Select>
          </InputGroup>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * Crédit garanti par portefeuille Actions • Montant ajouté au capital
          disponible • Remboursement sur flux • Fiscalité suspendue pendant
          crédit
        </div>
      </ParamCard>

      {/* PEL Card */}
      <ParamCard
        title={
          <>
            <span className="inline-flex items-center mr-2">
              <MdSettings size={20} />
            </span>
            PEL
          </>
        }
        color="from-cyan-400 via-sky-500 to-blue-500"
      >
        <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-600">
          <label htmlFor="pel-actif" className="font-bold text-sm">
            Activer le PEL
          </label>
          <Switch
            id="pel-actif"
            checked={params.pelActif}
            onChange={(e) => onParamChange("pelActif", e.target.checked)}
          />
        </div>
        <div
          className={`transition-opacity duration-300 ${
            params.pelActif ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <InputGroup label="Taux PEL (brut/an)">
            <NumberInput
              unit="%"
              value={params.pelTaux}
              onChange={(e) =>
                onParamChange("pelTaux", parseFloat(e.target.value))
              }
            />
          </InputGroup>
          <InputGroup label="Injecter PEL dans :">
            <Select
              value={params.pelInjection}
              onChange={(e) =>
                onParamChange(
                  "pelInjection",
                  e.target.value as "aucun" | "av" | "lombard"
                )
              }
            >
              <option value="aucun">Aucun (conserver PEL)</option>
              <option value="av">Assurance Vie (fin année 8)</option>
              <option value="lombard" disabled={!params.lombardActif}>
                Remboursement Lombard
              </option>
            </Select>
          </InputGroup>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/40 px-6 pb-4 rounded-b-3xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          * PEL 2025 : plafond 61 200 € • Taux 1,75% brut • Flat tax 30% sur
          intérêts • Source :{" "}
          <a
            href="https://www.service-public.fr/particuliers/vosdroits/F16140"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Service-Public.fr
          </a>
        </div>
      </ParamCard>
    </div>
  );
};
