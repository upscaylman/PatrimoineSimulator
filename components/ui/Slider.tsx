
import React from 'react';

export const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        type="range"
        {...props}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-primary"
    />
);
