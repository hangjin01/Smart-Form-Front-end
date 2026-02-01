import React from 'react';
import Sparkline from './Sparkline';

const SensorGraphCard = ({
    title,
    currentValue,
    history,
    unit,
    color,
    icon: Icon,
    target,
    onEdit,
    onClick
}: {
    title: string;
    currentValue: number;
    history: number[];
    unit: string;
    color: string;
    icon: any;
    target?: string;
    onEdit?: () => void;
    onClick?: () => void;
}) => (
    <div
        onClick={onClick}
        className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:bg-slate-800/80 hover:scale-[1.02] transition-all duration-300 border-l-4 h-full relative overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:shadow-slate-900/50 group"
        style={{ borderLeftColor: color }}
    >
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1.5 group-hover:text-slate-200 transition-colors">
                    <Icon size={12} style={{ color }} /> {title}
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-white">{currentValue}</span>
                    <span className="text-xs text-slate-500 mb-1">{unit}</span>
                </div>
            </div>
            {target && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit();
                    }}
                    className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                >
                    목표: {target}
                </button>
            )}
        </div>

        <div className="mt-3 h-12 w-full relative z-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline data={history} color={color} fill={true} />
        </div>
    </div>
);

export default SensorGraphCard;
