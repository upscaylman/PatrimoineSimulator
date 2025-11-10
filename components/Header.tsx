import React from "react";
import { MdAccountBalance, MdDarkMode, MdLightMode } from "react-icons/md";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const AutoUpdateBadge: React.FC = () => (
  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-green-500/90 text-white rounded-full shadow-md flex items-center justify-center w-7 h-7 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
    </span>
    <span className="hidden sm:inline text-xs sm:text-sm font-semibold ml-2">
      Mise à jour auto
    </span>
  </div>
);

const DarkModeToggle: React.FC<{ darkMode: boolean; toggle: () => void }> = ({
  darkMode,
  toggle,
}) => (
  <button
    onClick={toggle}
    aria-label="Toggle dark mode"
    className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
  >
    {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
  </button>
);

const Loader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <div
    className={`absolute top-4 sm:top-6 right-16 sm:right-20 w-10 h-10 transition-opacity duration-300 ${
      isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  isLoading,
}) => (
  <header className="bg-gradient-to-br from-primary to-secondary text-white p-8 text-center relative">
    <AutoUpdateBadge />
    <DarkModeToggle darkMode={darkMode} toggle={toggleDarkMode} />
    <Loader isLoading={isLoading} />

    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center justify-center gap-3">
      <MdAccountBalance size={48} />
      Simulateur Patrimonial Expert
    </h1>
    <p className="text-base md:text-lg opacity-90">
      Ingénierie patrimoniale & fiscalité française 2025 • Vos allocations dans
      3 scénarios
    </p>
  </header>
);
