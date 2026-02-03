import React from 'react';
import {
    Activity, LayoutGrid, LineChart, Maximize2, Thermometer, Droplets, Zap, Wind, Sun,
    Wifi, Cpu, Bot, Settings, FileText, Loader2, Bookmark, CloudRain, Fan, Lightbulb,
    ChevronRight, CheckCircle2, Megaphone, ExternalLink, Sprout
} from 'lucide-react';
import SensorCard from '../ui/SensorCard';
import SensorGraphCard from '../ui/SensorGraphCard';
import CropInput from '../ui/CropInput';
import ControlSwitch from '../ui/ControlSwitch';
import WeatherCard from '../ui/WeatherCard';
import { WELFARE_NEWS } from '../../constants';
import { SensorData, Crop, ControlState } from '../../types';

interface MainDashboardProps {
    sensorData: SensorData;
    sensorHistory: {
        temperature: number[];
        humidity: number[];
        soilMoisture: number[];
        co2: number[];
        lightIntensity: number[];
    };
    currentCropInfo: Crop | any;
    viewMode: 'cards' | 'graphs';
    setViewMode: (mode: 'cards' | 'graphs') => void;
    controls: ControlState;
    toggleControl: (key: keyof ControlState) => void;
    selectedCrop: string;
    setSelectedCrop: (crop: string) => void;
    handleAIAnalysis: () => void;
    isAnalyzing: boolean;
    aiAnalysis: string;
    handleSaveInsight: () => void;
    logs: string[];
    setCurrentScreen: (screen: 'dashboard' | 'welfare' | 'logs' | 'sensors') => void;
    setIsCropSettingsOpen: (isOpen: boolean) => void;
    setIsPromptModalOpen: (isOpen: boolean) => void;
    setIsSavedInsightsOpen: (isOpen: boolean) => void;
}

const MainDashboard = ({
    sensorData,
    sensorHistory,
    currentCropInfo,
    viewMode,
    setViewMode,
    controls,
    toggleControl,
    selectedCrop,
    setSelectedCrop,
    handleAIAnalysis,
    isAnalyzing,
    aiAnalysis,
    handleSaveInsight,
    logs,
    setCurrentScreen,
    setIsCropSettingsOpen,
    setIsPromptModalOpen,
    setIsSavedInsightsOpen
}: MainDashboardProps) => {
    return (
        <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">

            {/* Top Section Header with Toggle */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="text-indigo-400" size={20} /> 실시간 센서 모니터링
                </h2>

                <div className="bg-slate-800/80 p-1 rounded-lg flex items-center border border-slate-700 gap-2">
                    <div className="flex items-center">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'cards'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                }`}
                        >
                            <LayoutGrid size={14} /> 카드
                        </button>
                        <button
                            onClick={() => setViewMode('graphs')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'graphs'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                }`}
                        >
                            <LineChart size={14} /> 그래프
                        </button>
                    </div>

                    <div className="w-px h-4 bg-slate-700"></div>

                    <button
                        onClick={() => setCurrentScreen('sensors')}
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        title="전체 화면으로 보기"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Top Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-32">
                {viewMode === 'cards' ? (
                    <>
                        <SensorCard
                            title="대기 온도"
                            value={sensorData.temperature}
                            unit="°C"
                            icon={Thermometer}
                            color="#ef4444"
                            target={currentCropInfo.optimalTemp}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorCard
                            title="상대 습도"
                            value={sensorData.humidity}
                            unit="%"
                            icon={Droplets}
                            color="#3b82f6"
                            target={currentCropInfo.optimalHumidity}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorCard
                            title="토양 수분"
                            value={sensorData.soilMoisture}
                            unit="%"
                            icon={Zap}
                            color="#10b981"
                            target={currentCropInfo.optimalSoil}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorCard
                            title="CO2 농도"
                            value={sensorData.co2}
                            unit="ppm"
                            icon={Wind}
                            color="#8b5cf6"
                            target={currentCropInfo.optimalCo2}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorCard
                            title="일조량"
                            value={sensorData.lightIntensity}
                            unit="lux"
                            icon={Sun}
                            color="#f59e0b"
                            target={currentCropInfo.optimalLux}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                    </>
                ) : (
                    <>
                        <SensorGraphCard
                            title="대기 온도"
                            currentValue={sensorData.temperature}
                            history={sensorHistory.temperature}
                            unit="°C"
                            icon={Thermometer}
                            color="#ef4444"
                            target={currentCropInfo.optimalTemp}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorGraphCard
                            title="상대 습도"
                            currentValue={sensorData.humidity}
                            history={sensorHistory.humidity}
                            unit="%"
                            icon={Droplets}
                            color="#3b82f6"
                            target={currentCropInfo.optimalHumidity}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorGraphCard
                            title="토양 수분"
                            currentValue={sensorData.soilMoisture}
                            history={sensorHistory.soilMoisture}
                            unit="%"
                            icon={Zap}
                            color="#10b981"
                            target={currentCropInfo.optimalSoil}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorGraphCard
                            title="CO2 농도"
                            currentValue={sensorData.co2}
                            history={sensorHistory.co2}
                            unit="ppm"
                            icon={Wind}
                            color="#8b5cf6"
                            target={currentCropInfo.optimalCo2}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                        <SensorGraphCard
                            title="일조량"
                            currentValue={sensorData.lightIntensity}
                            history={sensorHistory.lightIntensity}
                            unit="lux"
                            icon={Sun}
                            color="#f59e0b"
                            target={currentCropInfo.optimalLux}
                            onEdit={() => setIsCropSettingsOpen(true)}
                            onClick={() => setCurrentScreen('sensors')}
                        />
                    </>
                )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Camera Feed Mockup */}
                    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700 relative group">
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded animate-pulse">LIVE</span>
                            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm flex items-center gap-1">
                                <Wifi size={10} /> CAM-01
                            </span>
                        </div>
                        <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                            {/* This would be the video stream in a real app */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-60"></div>
                            <div className="z-0 absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <Cpu className="text-slate-600 opacity-20 w-32 h-32 absolute" />
                        </div>
                        <div className="p-4 flex justify-between items-center bg-slate-900/50">
                            <div className="text-sm text-slate-400">
                                <span className="text-green-400 font-medium">System Normal</span> • AI Vision Detection Active
                            </div>
                            <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors">
                                전체 화면
                            </button>
                        </div>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 relative z-10 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">AI 농업 컨설턴트</h2>
                                    <p className="text-xs text-indigo-300">Powered by Gemini 3 Flash</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {/* Crop Selector - Now Searchable/Typable Input */}
                                <CropInput
                                    value={selectedCrop}
                                    onChange={setSelectedCrop}
                                />

                                {/* Settings Buttons */}
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setIsPromptModalOpen(true)}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500"
                                        title="프롬프트 설정"
                                    >
                                        <Settings size={20} />
                                    </button>
                                    <button
                                        onClick={() => setIsSavedInsightsOpen(true)}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-lg transition-colors border border-slate-600 hover:border-indigo-500"
                                        title="저장된 기록 보기"
                                    >
                                        <FileText size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAIAnalysis}
                                    disabled={isAnalyzing}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isAnalyzing
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                        }`}
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 size={16} className="animate-spin" /> 분석 중...</>
                                    ) : (
                                        <><Zap size={16} /> 분석 요청</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-xl p-4 min-h-[140px] border border-slate-700/50 relative z-10">
                            {aiAnalysis ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <div className="whitespace-pre-line text-slate-300 leading-relaxed">
                                        {aiAnalysis}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs border border-green-500/20">데이터 기반</span>
                                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">실시간 분석</span>
                                        </div>
                                        <button
                                            onClick={handleSaveInsight}
                                            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                                        >
                                            <Bookmark size={14} /> 결과 저장
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-32 text-slate-500 gap-2">
                                    <Activity size={32} className="opacity-50" />
                                    <p className="text-sm">현재 {selectedCrop}의 상태를 분석하려면 버튼을 누르세요.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar (Controls & Logs) */}
                <div className="space-y-6">

                    {/* Control Panel */}
                    <div className="glass-panel rounded-2xl p-5 border border-slate-700">
                        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                            환경 제어 (원격)
                        </h3>

                        {/* Weather Widget */}
                        <div className="mb-4">
                            <WeatherCard />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            <ControlSwitch
                                label="스마트 관수"
                                isOn={controls.irrigation}
                                onToggle={() => toggleControl('irrigation')}
                                icon={CloudRain}
                            />
                            <ControlSwitch
                                label="순환 환기팬"
                                isOn={controls.fan}
                                onToggle={() => toggleControl('fan')}
                                icon={Fan}
                            />
                            <ControlSwitch
                                label="생장 LED"
                                isOn={controls.growLight}
                                onToggle={() => toggleControl('growLight')}
                                icon={Lightbulb}
                            />
                            <ControlSwitch
                                label="자동 측창"
                                isOn={controls.windows}
                                onToggle={() => toggleControl('windows')}
                                icon={Wind}
                            />
                        </div>
                    </div>

                    {/* System Logs */}
                    <div className="glass-panel rounded-2xl p-5 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-bold text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-slate-500 rounded-full"></div>
                                시스템 로그
                            </h3>
                            <button
                                onClick={() => setCurrentScreen('logs')}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                더보기 <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {logs.length === 0 && <p className="text-xs text-slate-600">최근 기록이 없습니다.</p>}
                            {logs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 pb-2 border-b border-slate-800 last:border-0">
                                    <CheckCircle2 size={12} className="mt-0.5 text-green-500 shrink-0" />
                                    <span>{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crop Info Mini Card */}
                    <div className="glass-panel rounded-xl p-4 bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-900/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-green-400 font-bold uppercase">Target Crop</span>
                                <h4 className="text-lg font-bold text-white mt-1">{currentCropInfo.variety} {currentCropInfo.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">생육 단계: 생장기 (Day 45)</p>
                            </div>
                            <Sprout className="text-green-500" size={32} />
                        </div>
                        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-right text-[10px] text-slate-500 mt-1">수확 예정: 25일 후</p>
                    </div>

                    {/* Welfare & Support Board */}
                    <div className="glass-panel rounded-2xl p-5 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-bold text-white flex items-center gap-2">
                                <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                                정부 지원 & 복지 혜택
                            </h3>
                            <button
                                onClick={() => setCurrentScreen('welfare')}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                더보기 <ChevronRight size={12} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {WELFARE_NEWS.map((news) => (
                                <div key={news.id} className="group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${news.color} ${news.bg} ${news.border}`}>
                                            {news.type}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                                            {news.dDay} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                                        {news.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800">
                            <div className="bg-indigo-500/10 rounded-lg p-3 flex items-center gap-3 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-pointer">
                                <div className="bg-indigo-500/20 p-2 rounded-full text-indigo-400">
                                    <Megaphone size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-indigo-300">맞춤형 지원사업 알림 받기</p>
                                    <p className="text-[10px] text-indigo-400/70">내 작물과 지역에 맞는 혜택 알림</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default MainDashboard;
