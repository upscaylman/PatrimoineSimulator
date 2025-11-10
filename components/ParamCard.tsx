import React from "react";

interface ParamCardProps {
  title: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

export const ParamCard: React.FC<ParamCardProps> = ({
  title,
  color,
  children,
}) => {
  return (
    <div className="bg-surface-container-light dark:bg-surface-container-dark rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden h-full flex flex-col">
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-bold text-on-surface-light dark:text-on-surface-dark mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};
