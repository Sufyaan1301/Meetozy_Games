'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

// Dynamically import the Phaser component with SSR disabled
// This is critical because Phaser relies heavily on the 'window' object
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Office...</div>
});

export default function Home() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showEmotes, setShowEmotes] = useState(false);
  const [myEmote, setMyEmote] = useState<string | null>(null);

  const handleEmote = (emoji: string) => {
    setMyEmote(emoji);
    setShowEmotes(false);
    setTimeout(() => setMyEmote(null), 3000); // Clear emote after 3s
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* Game Layer */}
      <div className="absolute inset-0 z-0">
        <PhaserGame />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 transition-all">
        
        {/* TOP BAR AREA */}
        <div className="flex flex-col items-center pointer-events-auto">
             {/* Toggle Handle */}
             <button 
                onClick={() => setShowParticipants(!showParticipants)}
                className="bg-black/50 hover:bg-black/80 text-white text-xs px-3 py-1 rounded-b-lg backdrop-blur-md mb-2 border-x border-b border-white/10 shadow-sm"
             >
                {showParticipants ? 'Hide Participants ▲' : 'Show Participants ▼'}
             </button>

            {/* Participants Strip */}
            <div className={`flex justify-center gap-4 transition-all duration-300 origin-top transform ${showParticipants ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                {/* Participant 1 */}
                <div className="w-40 h-28 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    User 1
                    </div>
                    <div className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">Alex</div>
                </div>
                
                {/* Participant 2 */}
                <div className="w-40 h-28 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    User 2
                    </div>
                    <div className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">Sarah</div>
                </div>

                {/* YOU */}
                <div className="w-40 h-28 bg-gray-800 rounded-lg border-2 border-blue-500 overflow-hidden relative shadow-lg">
                    {isCamOn ? (
                    <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                        <span className="text-4xl">😊</span>
                    </div>
                    ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-black">
                        Camera Off
                    </div>
                    )}
                    {myEmote && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-bounce">
                            <span className="text-5xl">{myEmote}</span>
                        </div>
                    )}
                    <div className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">You {isMicOn ? '' : '(Muted)'}</div>
                </div>
            </div>
        </div>

        {/* BOTTOM BAR AREA */}
        <div className="flex flex-col items-center pointer-events-auto relative">
            
            {/* Controls Container (Collapsible) */}
            <div className={`mb-2 flex flex-col items-center transition-all duration-300 origin-bottom transform ${showControls ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                {/* Emote Picker */}
                {showEmotes && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl flex gap-2 animate-fade-in mb-2">
                        {['👋', '👍', '❤️', '😂', '😮'].map(emoji => (
                            <button 
                                key={emoji}
                                onClick={() => handleEmote(emoji)}
                                className="text-2xl hover:scale-125 transition-transform p-1"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Dock */}
                <div className="bg-black/80 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-6 border border-white/10 shadow-2xl">
                    <button 
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-4 rounded-full transition-all ${isMicOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        title="Toggle Microphone"
                    >
                        {isMicOn ? '🎤' : '🔇'}
                    </button>

                    <button 
                        onClick={() => setIsCamOn(!isCamOn)}
                        className={`p-4 rounded-full transition-all ${isCamOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        title="Toggle Camera"
                    >
                        {isCamOn ? '📷' : '🚫'}
                    </button>

                    <button 
                        onClick={() => setShowEmotes(!showEmotes)}
                        className="p-4 rounded-full bg-gray-700 text-white hover:bg-yellow-500 hover:text-black transition-all"
                        title="Reaction"
                    >
                        😀
                    </button>

                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold ml-4">
                        End
                    </button>
                </div>
            </div>

            {/* Toggle Handle (Bottom) */}
             <button 
                onClick={() => setShowControls(!showControls)}
                className="bg-black/50 hover:bg-black/80 text-white text-xs px-3 py-1 rounded-t-lg backdrop-blur-md border-x border-t border-white/10 shadow-sm"
             >
                {showControls ? 'Hide Controls ▼' : 'Show Controls ▲'}
             </button>
        </div>

      </div>
    </main>
  );
}
