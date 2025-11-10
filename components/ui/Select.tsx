import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="relative">
      <select
        {...props}
        className={`
          w-full px-4 py-2.5 pr-12 border-2 border-gray-300 dark:border-gray-500 rounded-xl 
          bg-white dark:bg-gray-800/80 text-base font-semibold text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-primary focus:border-primary 
          transition-all shadow-sm hover:shadow-md cursor-pointer
          appearance-none
          ${className}
        `}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <MdKeyboardArrowDown
          size={24}
          className="text-gray-500 dark:text-gray-300"
        />
      </div>
    </div>
  );
};
