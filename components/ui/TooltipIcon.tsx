import React from "react";

export const TooltipIcon: React.FC<{ text: string }> = ({ text }) => (
  <span className="group relative inline-flex items-center justify-center w-4 h-4 ml-1 sm:ml-2 bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold rounded-full cursor-help flex-shrink-0">
    ?
    <span className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-56 sm:w-64 p-3 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
      {text}
      <svg
        className="absolute text-gray-800 dark:text-gray-900 h-2 w-full left-0 sm:left-1/2 sm:-translate-x-1/2 top-full"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </span>
  </span>
);
