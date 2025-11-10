import React from "react";
import {
  MdBarChart,
  MdLightbulb,
  MdTableChart,
  MdTrendingUp,
} from "react-icons/md";

type ResultsTab = "synthese" | "graphiques" | "tableaux" | "analyse";

interface ResultsTabsProps {
  activeTab: ResultsTab;
  onTabChange: (tab: ResultsTab) => void;
}

const tabs: Array<{
  id: ResultsTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: "synthese", label: "Synthèse", icon: MdTrendingUp },
  { id: "graphiques", label: "Graphiques", icon: MdBarChart },
  { id: "tableaux", label: "Tableaux", icon: MdTableChart },
  { id: "analyse", label: "Analyse", icon: MdLightbulb },
];

export const ResultsTabs: React.FC<ResultsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav
        className="flex flex-wrap gap-2 overflow-x-auto"
        aria-label="Onglets de résultats"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 font-semibold text-sm transition-all duration-300
                border-b-2 rounded-t-lg whitespace-nowrap flex-shrink-0
                ${
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100"
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
