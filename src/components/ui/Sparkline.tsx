import React from 'react';

const Sparkline = ({ data, color, fill = false }: { data: number[], color: string, fill?: boolean }) => {
    const width = 200;
    const height = 60;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * (height * 0.8) - (height * 0.1); // Add padding
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `0,${height} ${points} ${width},${height}`;

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            {fill && (
                <polygon
                    points={fillPath}
                    fill={color}
                    fillOpacity="0.1"
                />
            )}
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Sparkline;
