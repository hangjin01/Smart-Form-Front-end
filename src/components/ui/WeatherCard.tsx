import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, CalendarDays } from 'lucide-react';

const WeatherCard = () => {
    // Mock Data for "Jeonju, Jeonbuk" (Smart Farm Hub)
    const currentWeather = {
        location: "전북 전주시",
        temp: 18.5,
        condition: "Cloudy",
        humidity: 65,
        windSpeed: 3.2,
        rainProb: 30,
        forecast: [
            { day: "오늘", type: "cloudy", temp: "15°/22°", rain: "30%" },
            { day: "내일", type: "rain", temp: "14°/20°", rain: "80%" },
            { day: "모레", type: "sun", temp: "16°/24°", rain: "10%" },
        ]
    };

    const getIcon = (type: string, size: number = 20, className: string = "") => {
        switch (type.toLowerCase()) {
            case 'rain': return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
            case 'cloudy': return <Cloud size={size} className={`text-slate-400 ${className}`} />;
            case 'sun': return <Sun size={size} className={`text-yellow-400 ${className}`} />;
            default: return <Sun size={size} className={`text-yellow-400 ${className}`} />;
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-5 border border-slate-700 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                        <MapPin size={16} className="text-red-400" />
                        {currentWeather.location}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <CalendarDays size={12} /> {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-white">{currentWeather.temp}°</span>
                    <span className="text-xs text-slate-400">{currentWeather.condition}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
                    <Droplets size={14} className="text-blue-400" />
                    <span className="text-xs text-slate-300">{currentWeather.humidity}%</span>
                    <span className="text-[10px] text-slate-500">습도</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
                    <Wind size={14} className="text-indigo-400" />
                    <span className="text-xs text-slate-300">{currentWeather.windSpeed}m/s</span>
                    <span className="text-[10px] text-slate-500">풍속</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
                    <CloudRain size={14} className="text-cyan-400" />
                    <span className="text-xs text-slate-300">{currentWeather.rainProb}%</span>
                    <span className="text-[10px] text-slate-500">강수확률</span>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">주간 예보</h4>
                {currentWeather.forecast.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <span className="text-xs font-medium text-slate-300 w-10">{day.day}</span>
                        <div className="flex items-center gap-2 flex-1 justify-center">
                            {getIcon(day.type, 16)}
                            <span className="text-xs text-slate-400">{day.type === 'rain' ? day.rain : day.type === 'cloudy' ? '흐림' : '맑음'}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-300">{day.temp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherCard;
