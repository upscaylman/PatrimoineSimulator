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
    <div className="bg-surface-container-light dark:bg-surface-container-dark rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative">
      <div className={`h-3 bg-gradient-to-r ${color} shadow-sm`}></div>
      <div className="p-6 flex-grow flex flex-col min-h-0 pb-0">
        <h3 className="text-xl font-extrabold text-on-surface-light dark:text-on-surface-dark mb-6 flex items-center gap-2 flex-shrink-0">
          {title}
        </h3>
        <div className="space-y-4 flex-grow min-h-0 flex flex-col pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};
