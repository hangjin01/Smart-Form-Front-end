import React from 'react';

const ControlSwitch = ({
    label,
    isOn,
    onToggle,
    icon: Icon
}: {
    label: string;
    isOn: boolean;
    onToggle: () => void;
    icon: any;
}) => (
    <div className="glass-panel p-4 rounded-xl flex flex-col items-center gap-3 relative overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 ${isOn ? 'opacity-100' : ''}`} />

        <div className="flex justify-between w-full items-center z-10">
            <div className="flex items-center gap-2">
                <Icon size={20} className={isOn ? "text-green-400" : "text-slate-500"} />
                <span className="font-medium text-slate-200">{label}</span>
            </div>
            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${isOn ? 'bg-green-500' : 'bg-slate-600'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${isOn ? 'translate-x-6' : ''}`} />
            </button>
        </div>
        <div className="w-full flex justify-between items-center z-10 mt-1">
            <span className="text-xs text-slate-400">{isOn ? '작동 중' : '대기 중'}</span>
            {isOn && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>}
        </div>
    </div>
);

export default ControlSwitch;
