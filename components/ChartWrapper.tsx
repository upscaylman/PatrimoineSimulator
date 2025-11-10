
import React, { useRef, useEffect } from 'react';
import type { ChartConfiguration, Chart } from 'chart.js';

interface ChartWrapperProps {
    type: 'line' | 'bar';
    data: any;
    options?: any;
    title: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ type, data, options, title }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

        const defaultOptions: any = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: (value: number) => value.toLocaleString('fr-FR') + ' €',
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                     grid: {
                        color: gridColor
                    }
                }
            }
        };

        const config: ChartConfiguration = {
            type,
            data,
            options: { ...defaultOptions, ...options }
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new (window as any).Chart(canvasRef.current, config);

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [type, data, options]);

    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-center text-on-surface-light dark:text-on-surface-dark">{title}</h3>
            <div className="h-80">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};
