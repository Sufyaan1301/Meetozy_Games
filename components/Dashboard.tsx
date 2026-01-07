'use client';

import { useState } from 'react';

interface DashboardProps {
    onEnterGame: (target?: string) => void;
}

import AINotes from './AINotes';

export default function Dashboard({ onEnterGame }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'home' | 'ai-notes'>('home');

    return (
        <div className="flex w-screen h-screen bg-[#0a0a16] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col p-6 gap-8 border-r border-white/5 bg-white/5 backdrop-blur-xl z-20">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img src="/logo.png" alt="Meeto" className="h-16 w-auto object-contain" />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    <NavItem 
                        icon="🏠" 
                        label="Home" 
                        active={activeTab === 'home'} 
                        onClick={() => setActiveTab('home')}
                    />
                    <NavItem icon="🏢" label="Offices" badge="3" />
                    <NavItem icon="📅" label="Meetings" />
                    <NavItem 
                        icon="✨" 
                        label="AI Notes" 
                        highlight 
                        active={activeTab === 'ai-notes'}
                        onClick={() => setActiveTab('ai-notes')}
                    />
                    <NavItem icon="📆" label="Google Calendar" />
                    <NavItem icon="⚙️" label="Settings" />
                </nav>

                {/* User Profile (Bottom) */}
                <div className="mt-auto flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">User Profile</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-gray-400">Online</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-hidden relative flex flex-col">
                 {/* Background decoration */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

                {activeTab === 'home' ? (
                    <div className="grid grid-rows-[3fr_2fr] gap-6 h-full">
                        {/* Top Section: Office Preview */}
                        <div className="relative rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
                            <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-white">12 Users Online</span>
                            </div>

                            {/* Image Placeholder - relying on the one we moved or a placeholder if missing */}
                            <div 
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: "url('/dashboard-game.png')" }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent opacity-80" />

                            {/* Enter Button (Centered) */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button 
                                    onClick={() => onEnterGame()}
                                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.5)] border border-white/20 hover:scale-110 hover:shadow-[0_0_60px_rgba(236,72,153,0.7)] transition-all active:scale-95 z-20 group-hover:-translate-y-2 relative overflow-hidden"
                                >
                                    <span className="relative z-10">ENTER OFFICE</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom Section: Widgets */}
                        <div className="grid grid-cols-3 gap-6">
                            {/* Today's Meetings */}
                            <Widget title="Today's Meetings">
                                <div className="flex flex-col gap-3">
                                    <MeetingItem 
                                        time="3:00 AM" 
                                        title="Today's Meeting 1" 
                                        active 
                                        onJoin={() => onEnterGame('meeting-room')}
                                    />
                                    <MeetingItem time="5:00 AM" title="Today's Meeting 2" />
                                    <MeetingItem time="11:00 AM" title="Today's Meeting 3" />
                                </div>
                            </Widget>

                            {/* AI Tasks */}
                            <Widget title="AI Tasks ✨">
                                <div className="flex flex-col gap-3">
                                    <TaskItem label="Introductions check" />
                                    <TaskItem label="Checklist my meetings" />
                                    <TaskItem label="AI Highlight 🚀" checked />
                                    <TaskItem label="Check Task segments" />
                                </div>
                            </Widget>

                            {/* Recent AI Summaries */}
                            <Widget title="Recent AI Summaries">
                                <div 
                                    onClick={() => setActiveTab('ai-notes')}
                                    className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                >
                                    <h4 className="font-semibold text-white group-hover:text-pink-400 transition-colors">Project Sync</h4>
                                    <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <Tag label="Tags" />
                                        <Tag label="Snippet" />
                                        <Tag label="Moons" />
                                    </div>
                                </div>
                                {/* Stack effect */}
                                <div className="mx-4 h-2 bg-white/5 rounded-b-xl border-x border-b border-white/5 opacity-50" />
                                <div className="mx-8 h-2 bg-white/5 rounded-b-xl border-x border-b border-white/5 opacity-30" />
                            </Widget>
                        </div>
                    </div>
                ) : (
                    <AINotes />
                )}
            </main>
        </div>
    );
}


// Subcomponents for cleaner code
function NavItem({ icon, label, active, badge, highlight, onClick }: { icon: string, label: string, active?: boolean, badge?: string, highlight?: boolean, onClick?: () => void }) {
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <span className="text-lg">{icon}</span>
            <span className={`font-medium ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300' : ''}`}>{label}</span>
            {badge && <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </a>
    );
}

function Widget({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-[#13132b]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-lg hover:border-white/10 transition-colors">
            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {children}
            </div>
        </div>
    );
}

function MeetingItem({ time, title, active, onJoin }: { time: string, title: string, active?: boolean, onJoin?: () => void }) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-gradient-to-r from-white/10 to-transparent border-pink-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{title}</span>
                <span className="text-xs text-gray-400">2023 - {time}</span>
            </div>
            {active && (
                <button 
                    onClick={onJoin} 
                    className="bg-gradient-to-r from-pink-500 to-violet-600 text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110"
                >
                    Join
                </button>
            )}
             {!active && <div className="w-1 h-8 rounded-full bg-blue-500/30" />}
        </div>
    );
}

function TaskItem({ label, checked }: { label: string, checked?: boolean }) {
    return (
        <div className={`flex items-center gap-3 p-2 rounded-lg ${checked ? 'bg-white/10' : 'hover:bg-white/5'}`}>
             <div className={`w-5 h-5 rounded border flex items-center justify-center ${checked ? 'bg-pink-500 border-pink-500' : 'border-gray-600'}`}>
                 {checked && <span className="text-xs">✓</span>}
             </div>
             <span className={`text-sm ${checked ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}

function Tag({ label }: { label: string }) {
    return <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md text-gray-300">{label}</span>;
}
