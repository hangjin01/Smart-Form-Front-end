import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, CheckCircle2, Clock, List } from 'lucide-react';
import { MOCK_SYSTEM_LOGS } from '../../constants';

const SystemLogsBoard = ({ onBack }: { onBack: () => void }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

    const filters = [
        { id: 'all', label: '전체' },
        { id: 'control', label: '제어' },
        { id: 'system', label: '시스템' },
        { id: 'warning', label: '경고' },
        { id: 'ai', label: 'AI' }
    ];

    const filteredLogs = MOCK_SYSTEM_LOGS.filter(log => {
        const matchesFilter = activeFilter === 'all' || log.type === activeFilter;
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const parseLogTime = (timeStr: string) => {
        try {
            const [period, time] = timeStr.split(' ');
            const [h, m, s] = time.split(':').map(Number);
            let hours = h;
            if (period === '오후' && hours !== 12) hours += 12;
            if (period === '오전' && hours === 12) hours = 0;
            return hours * 3600 + m * 60 + s;
        } catch (e) {
            return 0;
        }
    };

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        const timeA = parseLogTime(a.timestamp);
        const timeB = parseLogTime(b.timestamp);
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'error': return 'text-red-400';
            case 'info': return 'text-blue-400';
            default: return 'text-slate-400';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'control': return '장치 제어';
            case 'system': return '시스템';
            case 'ai': return 'AI 분석';
            case 'sensor': return '센서 감지';
            case 'warning': return '경고';
            case 'user': return '사용자';
            default: return type;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6 pb-20">
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

                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-slate-500 rounded-full"></span>
                            시스템 로그 전체보기
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 ml-5">스마트팜의 모든 활동 및 상태 변화 기록입니다.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="로그 검색..."
                                className="bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-64"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                className={`p-2 rounded-xl border transition-colors ${isSortMenuOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'}`}
                            >
                                <Filter size={20} />
                            </button>

                            {isSortMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1">
                                    <button
                                        onClick={() => { setSortOrder('newest'); setIsSortMenuOpen(false); }}
                                        className={`text-left px-4 py-2 text-sm hover:bg-slate-700/50 transition-colors ${sortOrder === 'newest' ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}
                                    >
                                        최신순
                                    </button>
                                    <button
                                        onClick={() => { setSortOrder('oldest'); setIsSortMenuOpen(false); }}
                                        className={`text-left px-4 py-2 text-sm hover:bg-slate-700/50 transition-colors ${sortOrder === 'oldest' ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}
                                    >
                                        오래된순
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter.id
                                ? 'bg-slate-700 text-white shadow-lg'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Logs List */}
            <div className="glass-panel rounded-2xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200 font-medium">
                            <tr>
                                <th className="px-6 py-4 w-20">상태</th>
                                <th className="px-6 py-4 w-32">유형</th>
                                <th className="px-6 py-4">내용</th>
                                <th className="px-6 py-4 w-40">시간</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {sortedLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <CheckCircle2 size={16} className={getStatusColor(log.status)} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-700">
                                            {getTypeLabel(log.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-200 font-medium">
                                        {log.message}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-slate-500" />
                                            {log.timestamp}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sortedLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <List size={32} className="mx-auto mb-2 opacity-20" />
                                        표시할 로그가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemLogsBoard;
