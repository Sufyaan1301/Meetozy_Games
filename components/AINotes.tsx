'use client';

import { useState } from 'react';

// Mock Data Types
interface Note {
    id: string;
    title: string;
    date: string;
    time: string;
    tags: string[];
    participants: string[];
    summary: string;
    actionItems: string[];
}

// Mock Data
const MOCK_NOTES: Note[] = [
    {
        id: '1',
        title: 'Project Sync Alpha',
        date: 'Oct 24, 2023',
        time: '10:00 AM',
        tags: ['Weekly', 'Dev'],
        participants: ['Alex', 'Sarah', 'Mike'],
        summary: 'Discussed the timeline for the new feature rollout. Agreed to prioritize the backend API development first. Frontend will start integration next week.',
        actionItems: [
            'Alex to finalize API specs by Friday',
            'Sarah to setup CI/CD pipeline',
            'Mike to review database schema'
        ]
    },
    {
        id: '2',
        title: 'Design Review: Dashboard',
        date: 'Oct 23, 2023',
        time: '2:30 PM',
        tags: ['Design', 'UI/UX'],
        participants: ['Jessica', 'Tom', 'Alex'],
        summary: 'Reviewed the new dashboard layout. The team liked the glassmorphism approach but suggested increasing contrast for accessibility. The sidebar navigation needs a refresh.',
        actionItems: [
            'Jessica to update color palette',
            'Tom to valid contrast ratios'
        ]
    },
    {
        id: '3',
        title: 'Marketing Strategy Q4',
        date: 'Oct 20, 2023',
        time: '11:00 AM',
        tags: ['Marketing', 'Strategy'],
        participants: ['Emily', 'David'],
        summary: 'Brainstormed ideas for the Q4 campaign. Focus will be on social media engagement and partnerships with influencers. Budget allocation confirmed.',
        actionItems: [
            'Emily to draft campaign brief',
            'David to contact influencers'
        ]
    }
];

export default function AINotes() {
    const [selectedNote, setSelectedNote] = useState<Note>(MOCK_NOTES[0]);

    const handleExport = () => {
        // Simple print trigger for now
        window.print();
    };

    return (
        <div className="flex h-full gap-6 text-white font-sans overflow-hidden">
            {/* Left Panel: List Notulensi */}
            <div className="w-1/3 bg-[#13132b]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                        AI Notulensi
                    </h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400">{MOCK_NOTES.length} Records</span>
                </div>
                
                {/* Search / Filter (Visual only for now) */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 text-xs">🔍</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                    {MOCK_NOTES.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => setSelectedNote(note)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 ${
                                selectedNote.id === note.id 
                                ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30 ring-1 ring-pink-500/20' 
                                : 'bg-transparent border-white/5'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-medium ${selectedNote.id === note.id ? 'text-white' : 'text-gray-300'}`}>
                                    {note.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">{note.date}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-3">{note.summary}</p>
                            <div className="flex gap-2">
                                {note.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-md text-gray-400 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Ringkasan Notulensi (Summary View) */}
            <div className="flex-1 bg-[#13132b]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col shadow-lg relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                            {selectedNote.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">📅 {selectedNote.date}</span>
                            <span className="flex items-center gap-1">⏰ {selectedNote.time}</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-gray-300">
                                {selectedNote.participants.join(', ')}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all active:scale-95 group"
                    >
                        <span className="text-lg group-hover:-translate-y-0.5 transition-transform">📄</span>
                        <span className="text-sm font-medium">Export PDF</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
                    {/* Summary Section */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-pink-300 mb-4">
                            <span className="text-xl">✨</span> Executive Summary
                        </h3>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 leading-relaxed text-gray-300">
                            {selectedNote.summary}
                        </div>
                    </section>

                    {/* Action Items Section */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-4">
                            <span className="text-xl">✅</span> Action Items
                        </h3>
                        <div className="grid gap-3">
                            {selectedNote.actionItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="w-5 h-5 rounded border border-gray-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-transparent" />
                                    </div>
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                     {/* Transcript / Raw Notes (Placeholder) */}
                     <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-300 mb-4">
                            <span className="text-xl">📝</span> Raw Transcript
                        </h3>
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-gray-500 text-sm italic text-center">
                            Full transcript is available in the connected cloud storage.
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
