import React, { useState, useEffect } from 'react';
import {
    Sprout, FileText, Bookmark, Trash2, Settings, X, Thermometer, Droplets, Zap, Wind, Sun, Save
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

import { SensorData, ControlState, SavedInsight, Crop } from './types';
import { INITIAL_CROP_TYPES, DEFAULT_PROMPT_TEMPLATE } from './constants';
import MainDashboard from './components/dashboard/MainDashboard';
import WelfareBoard from './components/dashboard/WelfareBoard';
import DetailedSensorBoard from './components/dashboard/DetailedSensorBoard';
import SystemLogsBoard from './components/dashboard/SystemLogsBoard';

const App = () => {
    // --- State ---
    const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'welfare' | 'logs' | 'sensors'>('dashboard');
    const [crops, setCrops] = useState<Crop[]>(INITIAL_CROP_TYPES);
    const [viewMode, setViewMode] = useState<'cards' | 'graphs'>('cards');

    const [sensorData, setSensorData] = useState<SensorData>({
        temperature: 24.5,
        humidity: 60.2,
        soilMoisture: 45.0,
        co2: 450,
        lightIntensity: 800,
        timestamp: new Date().toLocaleTimeString(),
    });

    // History state for graphs (store last 30 points)
    const [sensorHistory, setSensorHistory] = useState<{
        temperature: number[];
        humidity: number[];
        soilMoisture: number[];
        co2: number[];
        lightIntensity: number[];
    }>({
        temperature: Array(30).fill(24.5),
        humidity: Array(30).fill(60.2),
        soilMoisture: Array(30).fill(45.0),
        co2: Array(30).fill(450),
        lightIntensity: Array(30).fill(800),
    });

    const [controls, setControls] = useState<ControlState>({
        irrigation: false,
        fan: true,
        growLight: false,
        windows: false,
    });

    const [selectedCrop, setSelectedCrop] = useState<string>("딸기");
    const [aiAnalysis, setAiAnalysis] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCloudConnected, setIsCloudConnected] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    // Custom Prompt State
    const [customPrompt, setCustomPrompt] = useState<string>(DEFAULT_PROMPT_TEMPLATE);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    // Crop Settings State
    const [isCropSettingsOpen, setIsCropSettingsOpen] = useState(false);
    const [editingCropData, setEditingCropData] = useState<any>(null);

    // Saved Insights State
    const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
    const [isSavedInsightsOpen, setIsSavedInsightsOpen] = useState(false);

    // --- Effects ---

    // Load saved insights from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('smartfarm_insights');
        if (saved) {
            try {
                setSavedInsights(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved insights", e);
            }
        }
    }, []);

    // Save insights to local storage when updated
    useEffect(() => {
        localStorage.setItem('smartfarm_insights', JSON.stringify(savedInsights));
    }, [savedInsights]);

    // Simulate Cloud Data Stream
    useEffect(() => {
        const interval = setInterval(() => {
            setSensorData(prev => {
                const newData = {
                    temperature: parseFloat((prev.temperature + (Math.random() - 0.5)).toFixed(1)),
                    humidity: parseFloat((prev.humidity + (Math.random() - 0.5) * 2).toFixed(1)),
                    soilMoisture: parseFloat((prev.soilMoisture + (Math.random() - 0.5)).toFixed(1)),
                    co2: Math.floor(prev.co2 + (Math.random() - 0.5) * 10),
                    lightIntensity: Math.floor(prev.lightIntensity + (Math.random() - 0.5) * 20),
                    timestamp: new Date().toLocaleTimeString(),
                };

                // Update History
                setSensorHistory(h => ({
                    temperature: [...h.temperature.slice(1), newData.temperature],
                    humidity: [...h.humidity.slice(1), newData.humidity],
                    soilMoisture: [...h.soilMoisture.slice(1), newData.soilMoisture],
                    co2: [...h.co2.slice(1), newData.co2],
                    lightIntensity: [...h.lightIntensity.slice(1), newData.lightIntensity],
                }));

                return newData;
            });
        }, 2000); // Update every 2 seconds for smoother graph

        return () => clearInterval(interval);
    }, []);

    // Update editing data when modal opens
    useEffect(() => {
        if (isCropSettingsOpen) {
            const current = crops.find(c => c.name === selectedCrop);
            setEditingCropData(current ? { ...current } : null);
        }
    }, [isCropSettingsOpen, selectedCrop, crops]);

    // --- Handlers ---

    const toggleControl = (key: keyof ControlState) => {
        // Optimistic UI update
        setControls(prev => {
            const newState = !prev[key];
            const status = newState ? "켜짐" : "꺼짐";
            let deviceName = "";
            switch (key) {
                case 'irrigation': deviceName = "관수 시스템"; break;
                case 'fan': deviceName = "환기팬"; break;
                case 'growLight': deviceName = "생장 LED"; break;
                case 'windows': deviceName = "자동 측창"; break;
            }

            const logMsg = `[제어] ${deviceName} ${status} (Cloud Synced)`;
            setLogs(prevLogs => [logMsg, ...prevLogs].slice(0, 5));

            return { ...prev, [key]: newState };
        });
    };

    const interpolatePrompt = (template: string) => {
        const activeDevices = [
            controls.fan ? '환기팬' : '',
            controls.irrigation ? '관수' : '',
            controls.growLight ? 'LED' : '',
            controls.windows ? '측창' : ''
        ].filter(Boolean).join(', ') || '없음';

        return template
            .replace(/{{crop}}/g, selectedCrop)
            .replace(/{{temp}}/g, sensorData.temperature.toString())
            .replace(/{{humidity}}/g, sensorData.humidity.toString())
            .replace(/{{soil}}/g, sensorData.soilMoisture.toString())
            .replace(/{{co2}}/g, sensorData.co2.toString())
            .replace(/{{lux}}/g, sensorData.lightIntensity.toString())
            .replace(/{{devices}}/g, activeDevices);
    };

    const handleAIAnalysis = async () => {
        setIsAnalyzing(true);
        setAiAnalysis(""); // Clear previous

        try {
            // @ts-ignore - Process env from Vite
            const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

            if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
                throw new Error("API 키가 설정되지 않았습니다. .env.local 파일에 유효한 GEMINI_API_KEY를 입력해주세요.");
            }

            const ai = new GoogleGenAI({ apiKey: apiKey });

            const prompt = interpolatePrompt(customPrompt);

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp', // Updated to latest model, or fallback to 'gemini-pro'
                contents: prompt,
            });

            setAiAnalysis(response.text() || "분석 결과를 가져올 수 없습니다.");
            setLogs(prev => ["[AI] 환경 분석 완료", ...prev].slice(0, 5));

        } catch (error: any) {
            console.error("AI Error:", error);
            const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";
            // Display the actual error message in the UI for the user to see
            setAiAnalysis(`⚠️ 분석 실패: ${errorMessage}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const saveCropSettings = () => {
        if (!editingCropData) return;

        setCrops(prev => prev.map(c =>
            c.id === editingCropData.id ? editingCropData : c
        ));
        setLogs(prev => [`[설정] ${editingCropData.name} 생육 환경 설정 변경됨`, ...prev].slice(0, 5));
        setIsCropSettingsOpen(false);
    };

    const handleSaveInsight = () => {
        if (!aiAnalysis) return;
        const newInsight: SavedInsight = {
            id: Date.now().toString(),
            crop: selectedCrop,
            content: aiAnalysis,
            timestamp: new Date().toLocaleString()
        };
        setSavedInsights(prev => [newInsight, ...prev]);
        setLogs(prev => [`[저장] ${selectedCrop} AI 분석 결과 저장됨`, ...prev].slice(0, 5));
    };

    const handleDeleteInsight = (id: string) => {
        setSavedInsights(prev => prev.filter(i => i.id !== id));
    };

    // Gracefully handle undefined crop info (e.g. user typed a new crop name)
    const currentCropInfo = crops.find(c => c.name === selectedCrop) || {
        id: 'custom',
        name: selectedCrop,
        variety: '사용자 지정',
        optimalTemp: '',
        optimalHumidity: '',
        optimalSoil: '',
        optimalCo2: '',
        optimalLux: ''
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-10">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setCurrentScreen('dashboard')}
                        title="메인 화면으로 이동"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform duration-200">
                            <Sprout className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight group-hover:text-green-400 transition-colors">SmartFarm AI</h1>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className="text-xs text-slate-400 font-mono">CLOUD CONNECTED</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                            <span className="text-xs text-slate-400">마지막 동기화</span>
                            <span className="text-xs font-mono text-green-400">{sensorData.timestamp}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            {currentScreen === 'dashboard' ? (
                <MainDashboard
                    sensorData={sensorData}
                    sensorHistory={sensorHistory}
                    currentCropInfo={currentCropInfo}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    controls={controls}
                    toggleControl={toggleControl}
                    selectedCrop={selectedCrop}
                    setSelectedCrop={setSelectedCrop}
                    handleAIAnalysis={handleAIAnalysis}
                    isAnalyzing={isAnalyzing}
                    aiAnalysis={aiAnalysis}
                    handleSaveInsight={handleSaveInsight}
                    logs={logs}
                    setCurrentScreen={setCurrentScreen}
                    setIsCropSettingsOpen={setIsCropSettingsOpen}
                    setIsPromptModalOpen={setIsPromptModalOpen}
                    setIsSavedInsightsOpen={setIsSavedInsightsOpen}
                />
            ) : currentScreen === 'welfare' ? (
                <WelfareBoard onBack={() => setCurrentScreen('dashboard')} />
            ) : currentScreen === 'sensors' ? (
                <DetailedSensorBoard
                    history={sensorHistory}
                    currentData={sensorData}
                    onBack={() => setCurrentScreen('dashboard')}
                />
            ) : (
                <SystemLogsBoard onBack={() => setCurrentScreen('dashboard')} />
            )}

            {/* Saved Insights Modal */}
            {isSavedInsightsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <FileText className="text-indigo-400" size={20} />
                                <h3 className="font-bold text-lg text-white">저장된 AI 분석 기록</h3>
                            </div>
                            <button
                                onClick={() => setIsSavedInsightsOpen(false)}
                                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-4 bg-slate-950/30">
                            {savedInsights.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Bookmark size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>저장된 분석 기록이 없습니다.</p>
                                </div>
                            ) : (
                                savedInsights.map(insight => (
                                    <div key={insight.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
                                                    {insight.crop}
                                                </span>
                                                <span className="text-xs text-slate-500 font-mono">{insight.timestamp}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteInsight(insight.id)}
                                                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed pl-1 border-l-2 border-indigo-500/20">
                                            {insight.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Crop Settings Modal */}
            {isCropSettingsOpen && editingCropData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl flex flex-col">
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <Settings className="text-indigo-400" size={20} />
                                <div>
                                    <h3 className="font-bold text-lg text-white">{editingCropData.name} 환경 설정</h3>
                                    <p className="text-xs text-slate-400">품종: {editingCropData.variety}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCropSettingsOpen(false)}
                                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">권장 온도 범위 (°C)</label>
                                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors">
                                    <Thermometer size={16} className="text-red-400" />
                                    <input
                                        type="text"
                                        value={editingCropData.optimalTemp}
                                        onChange={(e) => setEditingCropData({ ...editingCropData, optimalTemp: e.target.value })}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-600"
                                        placeholder="예: 20~25"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">권장 습도 범위 (%)</label>
                                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors">
                                    <Droplets size={16} className="text-blue-400" />
                                    <input
                                        type="text"
                                        value={editingCropData.optimalHumidity}
                                        onChange={(e) => setEditingCropData({ ...editingCropData, optimalHumidity: e.target.value })}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-600"
                                        placeholder="예: 60~70"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">권장 토양 수분 (%)</label>
                                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors">
                                    <Zap size={16} className="text-green-400" />
                                    <input
                                        type="text"
                                        value={editingCropData.optimalSoil}
                                        onChange={(e) => setEditingCropData({ ...editingCropData, optimalSoil: e.target.value })}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-600"
                                        placeholder="예: 50~60"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">권장 CO2 농도 (ppm)</label>
                                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors">
                                    <Wind size={16} className="text-purple-400" />
                                    <input
                                        type="text"
                                        value={editingCropData.optimalCo2}
                                        onChange={(e) => setEditingCropData({ ...editingCropData, optimalCo2: e.target.value })}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-600"
                                        placeholder="예: 600~800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 font-medium">권장 일조량 (lux)</label>
                                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors">
                                    <Sun size={16} className="text-yellow-400" />
                                    <input
                                        type="text"
                                        value={editingCropData.optimalLux}
                                        onChange={(e) => setEditingCropData({ ...editingCropData, optimalLux: e.target.value })}
                                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-600"
                                        placeholder="예: 20k~30k"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="p-5 border-t border-slate-700 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
                            <button
                                onClick={() => setIsCropSettingsOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={saveCropSettings}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
                            >
                                <Save size={16} /> 저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prompt Editor Modal */}
            {isPromptModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <Settings className="text-indigo-400" size={20} />
                                <h3 className="font-bold text-lg text-white">AI 프롬프트 설정</h3>
                            </div>
                            <button
                                onClick={() => setIsPromptModalOpen(false)}
                                className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="mb-4">
                                <p className="text-sm text-slate-400 mb-2">사용 가능한 변수 (분석 시 실제 값으로 자동 대체됩니다):</p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    <span className="px-2 py-1 bg-slate-800 rounded text-green-400">{`{{crop}}`}</span>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-red-400">{`{{temp}}`}</span>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-blue-400">{`{{humidity}}`}</span>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-purple-400">{`{{co2}}`}</span>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-yellow-400">{`{{lux}}`}</span>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">{`{{devices}}`}</span>
                                </div>
                            </div>

                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                className="w-full h-80 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                placeholder="AI에게 전달할 명령어를 입력하세요..."
                            />
                        </div>

                        <div className="p-5 border-t border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-b-2xl">
                            <button
                                onClick={() => setCustomPrompt(DEFAULT_PROMPT_TEMPLATE)}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X size={16} /> 초기화
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsPromptModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => setIsPromptModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
                                >
                                    <Save size={16} /> 저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
