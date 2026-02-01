import React from 'react';
import { Edit3 } from 'lucide-react';

const SensorCard = ({
    title,
    value,
    unit,
    icon: Icon,
    color,
    target,
    onEdit,
    onClick
}: {
    title: string;
    value: number | string;
    unit: string;
    icon: any;
    color: string;
    target?: string;
    onEdit?: () => void;
    onClick?: () => void;
}) => (
    <div
        onClick={onClick}
        className="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/80 hover:scale-[1.02] transition-all duration-300 border-l-4 h-full cursor-pointer shadow-lg hover:shadow-xl hover:shadow-slate-900/50 group"
        style={{ borderLeftColor: color }}
    >
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1 group-hover:text-slate-200 transition-colors">{title}</p>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className="text-sm text-slate-500 mb-1">{unit}</span>
            </div>
            {target && (
                <div
                    className="mt-2 flex items-center gap-1.5 opacity-90 cursor-pointer group/target"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit();
                    }}
                    title="클릭하여 권장 범위 수정"
                >
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold group-hover/target:text-indigo-400 transition-colors">권장</span>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 group-hover/target:bg-indigo-500/20 group-hover/target:border-indigo-500/40 transition-all">
                        {target}{unit === 'lux' ? '' : unit}
                    </span>
                    <Edit3 size={10} className="text-slate-500 opacity-0 -translate-x-2 group-hover/target:translate-x-0 group-hover/target:opacity-100 transition-all duration-300" />
                </div>
            )}
        </div>
        <div className={`p-3 rounded-full bg-slate-800/80 text-${color}-400 group-hover:bg-slate-800 transition-colors`}>
            <Icon size={24} style={{ color: color }} />
        </div>
    </div>
);

export default SensorCard;
