import React, { useMemo } from "react";

export const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  const percentage = useMemo(() => {
    const value = parseFloat(props.value as string) || 0;
    const min = parseFloat(props.min as string) || 0;
    const max = parseFloat(props.max as string) || 100;
    return ((value - min) / (max - min)) * 100;
  }, [props.value, props.min, props.max]);

  return (
    <div className="relative w-full">
      <input
        type="range"
        {...props}
        className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer 
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary 
                   [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-lg 
                   [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                   [&::-webkit-slider-thumb]:dark:border-gray-800 [&::-webkit-slider-thumb]:transition-all 
                   [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:hover:shadow-xl
                   [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:active:scale-110
                   [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
                   [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-grab 
                   [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
                   [&::-moz-range-thumb]:dark:border-gray-800 [&::-moz-range-thumb]:shadow-lg
                   [&::-moz-range-thumb]:active:cursor-grabbing
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
                   focus:ring-offset-white dark:focus:ring-offset-gray-800"
        style={{
          background: `linear-gradient(to right, hsl(252, 75%, 66%) 0%, hsl(252, 75%, 66%) ${percentage}%, rgb(229, 231, 235) ${percentage}%, rgb(229, 231, 235) 100%)`,
        }}
      />
    </div>
  );
};
