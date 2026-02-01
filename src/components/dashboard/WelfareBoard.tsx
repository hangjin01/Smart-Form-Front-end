import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, ExternalLink, Settings, ChevronRight } from 'lucide-react';
import { ALL_WELFARE_POSTS } from '../../constants';

const WelfareBoard = ({ onBack }: { onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = ['전체', '지원금', '교육', '복지', '금융', '기술'];

    const filteredPosts = ALL_WELFARE_POSTS.filter(post => {
        const matchesTab = activeTab === '전체' || post.type === activeTab;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

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
                            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                            정부 지원 & 복지 혜택
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 ml-5">농업인을 위한 맞춤형 지원 정보를 한눈에 확인하세요.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="지원사업 검색..."
                                className="bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-64"
                            />
                        </div>
                        <button className="bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors">
                            <Bell size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid of Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map(post => (
                    <div key={post.id} className="glass-panel p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-2">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${post.color} ${post.bg} ${post.border}`}>
                                    {post.type}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                                    {post.dDay}
                                </span>
                            </div>
                            <ExternalLink size={16} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-all group-hover:text-indigo-400" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 line-clamp-1">
                            {post.title}
                        </h3>

                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                            {post.desc || '자세한 내용은 공고문을 확인해주세요. 다양한 혜택이 여러분을 기다립니다.'}
                        </p>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <Settings size={12} /> 농림축산식품부
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                                {post.date || '2024.01.01'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default WelfareBoard;
