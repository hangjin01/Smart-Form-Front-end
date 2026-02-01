import React, { useState } from 'react';
import { ArrowLeft, Thermometer, Droplets, Zap, Wind, Sun } from 'lucide-react';
import DetailedChart from '../ui/DetailedChart';
import { SensorData } from '../../types';

const DetailedSensorBoard = ({
    history,
    currentData,
    onBack
}: {
    history: {
        temperature: number[];
        humidity: number[];
        soilMoisture: number[];
        co2: number[];
        lightIntensity: number[];
    };
    currentData: SensorData;
    onBack: () => void;
}) => {
    const [timeRange, setTimeRange] = useState('1m');

    const ranges = [
        { id: '1m', label: '1분전' },
        { id: '1h', label: '1시간전' },
        { id: '5h', label: '5시간전' },
        { id: '1d', label: '1일전' },
        { id: '1mo', label: '1달전' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white w-fit transition-colors group"
                >
                    <div className="p-1.5 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">메인으로 돌아가기</span>
                </button>

                <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                            실시간 환경 데이터 상세 분석
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 ml-5">모든 센서의 실시간 변화 추이를 모니터링합니다.</p>
                    </div>

                    <div className="flex items-center gap-3 self-end xl:self-auto flex-wrap justify-end">
                        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                            {ranges.map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => setTimeRange(range.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${timeRange === range.id
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm text-slate-300 font-mono hidden sm:inline">Live Data Stream</span>
                            <span className="text-sm text-slate-300 font-mono sm:hidden">Live</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Large Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperature */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Thermometer size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">대기 온도</h3>
                                <p className="text-xs text-slate-500">Temperature</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{currentData.temperature}<span className="text-lg text-slate-500 ml-1">°C</span></div>
                        </div>
                    </div>
                    <div className="h-64 w-full bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <DetailedChart data={history.temperature} color="#ef4444" unit="°C" />
                    </div>
                </div>

                {/* Humidity */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Droplets size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">상대 습도</h3>
                                <p className="text-xs text-slate-500">Humidity</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{currentData.humidity}<span className="text-lg text-slate-500 ml-1">%</span></div>
                        </div>
                    </div>
                    <div className="h-64 w-full bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <DetailedChart data={history.humidity} color="#3b82f6" unit="%" />
                    </div>
                </div>

                {/* Soil Moisture */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Zap size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">토양 수분</h3>
                                <p className="text-xs text-slate-500">Soil Moisture</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{currentData.soilMoisture}<span className="text-lg text-slate-500 ml-1">%</span></div>
                        </div>
                    </div>
                    <div className="h-64 w-full bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <DetailedChart data={history.soilMoisture} color="#10b981" unit="%" />
                    </div>
                </div>

                {/* CO2 */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Wind size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">CO2 농도</h3>
                                <p className="text-xs text-slate-500">Carbon Dioxide</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{currentData.co2}<span className="text-lg text-slate-500 ml-1">ppm</span></div>
                        </div>
                    </div>
                    <div className="h-64 w-full bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <DetailedChart data={history.co2} color="#a855f7" unit="ppm" />
                    </div>
                </div>

                {/* Light - Full Width */}
                <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-700/50 hover:border-yellow-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Sun size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">일조량</h3>
                                <p className="text-xs text-slate-500">Light Intensity</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{currentData.lightIntensity}<span className="text-lg text-slate-500 ml-1">lux</span></div>
                        </div>
                    </div>
                    <div className="h-64 w-full bg-slate-900/30 rounded-xl p-4 border border-slate-800">
                        <DetailedChart data={history.lightIntensity} color="#eab308" unit="lux" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedSensorBoard;
