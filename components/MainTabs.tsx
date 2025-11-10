import React from "react";
import { MdBarChart, MdSettings } from "react-icons/md";

type MainTab = "configuration" | "resultats";

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  hasNewResults?: boolean;
}

export const MainTabs: React.FC<MainTabsProps> = ({
  activeTab,
  onTabChange,
  hasNewResults = false,
}) => {
  return (
    <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-6">
      <nav
        className="flex space-x-1 overflow-x-auto"
        aria-label="Onglets principaux"
      >
        <button
          onClick={() => onTabChange("configuration")}
          className={`
            flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-bold text-sm transition-all duration-300
            border-b-2 relative whitespace-nowrap flex-shrink-0
            ${
              activeTab === "configuration"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100"
            }
          `}
        >
          <MdSettings size={20} />
          <span>Configuration</span>
        </button>
        <button
          onClick={() => onTabChange("resultats")}
          className={`
            flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-bold text-sm transition-all duration-300
            border-b-2 relative whitespace-nowrap flex-shrink-0
            ${
              activeTab === "resultats"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100"
            }
          `}
        >
          <MdBarChart size={20} />
          <span>Résultats</span>
          {hasNewResults && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-white dark:border-gray-900"></span>
          )}
        </button>
      </nav>
    </div>
  );
};
