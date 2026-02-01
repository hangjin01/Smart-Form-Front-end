import React from 'react';

const DetailedChart = ({ data, color, unit }: { data: number[], color: string, unit: string }) => {
    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };

    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Add 10% padding to Y range so line doesn't touch top/bottom
    const renderMin = min - range * 0.1;
    const renderMax = max + range * 0.1;
    const renderRange = renderMax - renderMin;

    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * graphWidth;
        const y = padding.top + graphHeight - ((d - renderMin) / renderRange) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `${padding.left},${height - padding.bottom} ${points} ${width - padding.right},${height - padding.bottom}`;

    // Generate 5 Y-axis ticks
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const value = renderMin + ratio * renderRange;
        const y = padding.top + graphHeight - ratio * graphHeight;
        return { value, y };
    });

    // X-axis labels
    const xLabels = [
        { x: padding.left, text: '60초 전' },
        { x: padding.left + graphWidth / 2, text: '30초 전' },
        { x: width - padding.right, text: '현재' }
    ];

    const formatVal = (n: number) => {
        if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k';
        if (Math.abs(n) >= 100) return Math.round(n).toString();
        return n.toFixed(1);
    }

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible select-none">
            {/* Grid & Y Axis Labels */}
            {yTicks.map(({ value, y }, i) => (
                <g key={i}>
                    {/* Grid Line */}
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Label */}
                    <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="12" fontFamily="monospace" fontWeight="500">
                        {formatVal(value)}
                    </text>
                </g>
            ))}

            {/* X Axis Labels */}
            {xLabels.map((l, i) => (
                <text key={i} x={l.x} y={height - 5} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fill="#94a3b8" fontSize="12" fontWeight="500">
                    {l.text}
                </text>
            ))}

            {/* Graph Area */}
            <polygon points={fillPath} fill={color} fillOpacity="0.15" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Axis Lines */}
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#475569" strokeWidth="1" />
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#475569" strokeWidth="1" />
        </svg>
    );
};

export default DetailedChart;
