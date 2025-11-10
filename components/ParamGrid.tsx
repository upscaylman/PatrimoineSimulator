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
        color="from-primary to-secondary"
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

        {params.lombardActif && (
          <div className="my-4 p-3 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="font-semibold text-blue-800 dark:text-blue-200 text-sm flex items-center gap-1">
              <MdAccountBalance className="w-4 h-4" />+ Crédit Lombard
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              {Math.round(
                capitalTotalAvecLombard - params.capitalTotal
              ).toLocaleString()}{" "}
              € (année {params.lombardAnnee})
            </div>
          </div>
        )}

        <div className="border-t-2 border-primary/50 pt-3 mt-3">
          <div className="flex justify-between items-center font-semibold text-on-surface-light dark:text-on-surface-dark">
            <span>Capital total disponible :</span>
            <span className="text-lg text-primary font-bold">
              {Math.round(capitalTotalAvecLombard).toLocaleString()} €
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between my-5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <label
            htmlFor="inflation-actif"
            className="font-bold text-sm flex items-center gap-2"
          >
            Prendre en compte l'inflation
            <TooltipIcon text="Érosion du pouvoir d'achat. Activez pour voir la valeur réelle de votre patrimoine." />
          </label>
          <Switch
            id="inflation-actif"
            checked={params.inflationActif}
            onChange={(e) => onParamChange("inflationActif", e.target.checked)}
          />
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
        color="bg-green-500"
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
        color="bg-yellow-500"
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
        color="bg-red-500"
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
        color="from-yellow-500 to-blue-600"
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
        color="bg-blue-600"
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
        color="bg-blue-500"
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
          <InputGroup
            label="% à emprunter sur Actions"
            tooltip="LTV (Loan-to-Value) : % de votre portefeuille Actions que vous pouvez emprunter."
          >
            <Slider
              value={params.lombardAlloc}
              onChange={(e) =>
                onParamChange("lombardAlloc", parseFloat(e.target.value))
              }
              min="0"
              max="80"
              step="0.5"
            />
            <div className="text-center font-bold text-lg text-primary">
              {params.lombardAlloc.toFixed(1)}%
            </div>
          </InputGroup>
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
        color="bg-cyan-500"
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
      </ParamCard>
    </div>
  );
};
