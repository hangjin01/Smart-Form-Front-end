import React from 'react';
import { X } from 'lucide-react';

const CropInput = ({
    value,
    onChange,
    placeholder = "작물 입력..."
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) => {
    return (
        <div className="relative group">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-36 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none pl-3 pr-9 py-2.5 transition-all placeholder-slate-500"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-2 top-2.5 text-slate-500 hover:text-white p-0.5"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default CropInput;
