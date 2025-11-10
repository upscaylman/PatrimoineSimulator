
import React from 'react';

export const TooltipIcon: React.FC<{ text: string }> = ({ text }) => (
    <span className="group relative inline-flex items-center justify-center w-4 h-4 ml-2 bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold rounded-full cursor-help">
        ?
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {text}
            <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
            </svg>
        </span>
    </span>
);
