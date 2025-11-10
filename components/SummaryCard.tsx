import React from "react";

interface SummaryCardProps {
  title: React.ReactNode;
  value: number | string;
  isCurrency?: boolean;
  isPercent?: boolean;
  subtext?: React.ReactNode;
  customGradient?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  isCurrency,
  isPercent,
  subtext,
  customGradient,
}) => {
  let formattedValue =
    typeof value === "number"
      ? isCurrency
        ? value.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        : value.toLocaleString("fr-FR")
      : value;

  // Si c'est une valeur de type string qui commence par "+", on la garde telle quelle
  if (typeof value === "string" && value.startsWith("+")) {
    formattedValue = value;
  }

  const gradientClass = customGradient
    ? customGradient
    : "bg-gradient-to-br from-primary/80 to-secondary/80";

  return (
    <div className={`${gradientClass} text-white p-6 rounded-3xl shadow-lg`}>
      <h3 className="text-sm font-semibold opacity-80 mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {formattedValue}
        {isPercent && "%"}
      </p>
      {subtext && (
        <div className="text-xs opacity-80 mt-1 whitespace-pre-line">
          {subtext}
        </div>
      )}
    </div>
  );
};
