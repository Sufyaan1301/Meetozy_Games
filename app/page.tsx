'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from '@/components/Dashboard';

// Dynamically import the Phaser component with SSR disabled
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Office...</div>
});

export default function Home() {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'GAME'>('DASHBOARD');
  const [spawnTarget, setSpawnTarget] = useState<string | null>(null);
  
  // Media State
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showEmotes, setShowEmotes] = useState(false);
  const [myEmote, setMyEmote] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSittingInMeeting, setIsSittingInMeeting] = useState(false);
  const [showAINotesOverlay, setShowAINotesOverlay] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Camera Effect
  useEffect(() => {
    // Only run media effects if we are in the GAME view
    if (currentView !== 'GAME') return;

    let stream: MediaStream | null = null;

    if (isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setIsCamOn(false);
        });
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamOn, currentView]);

  // Microphone Effect
  useEffect(() => {
    if (currentView !== 'GAME') return;

    let stream: MediaStream | null = null;

    if (isMicOn) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((mediaStream) => {
          stream = mediaStream;
          
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          
          const audioContext = audioContextRef.current;
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.4;

          const source = audioContext.createMediaStreamSource(mediaStream);
          source.connect(analyser);
          mediaStreamSourceRef.current = source;
          
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;

            if (average > 10) {
                setIsSpeaking(true);
            } else {
                setIsSpeaking(false);
            }
            
            animationFrameRef.current = requestAnimationFrame(checkVolume);
          };

          checkVolume();

        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          setIsMicOn(false);
        });
    } else {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        setIsSpeaking(false);
    }

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [isMicOn, currentView]);

  const handleEmote = (emoji: string) => {
    setMyEmote(emoji);
    setShowEmotes(false);
    setTimeout(() => setMyEmote(null), 3000);
  };

  const handleLeaveGame = () => {
      setCurrentView('DASHBOARD');
      setSpawnTarget(null); // Reset spawn target
  };

  const handleEnterGame = (target?: string) => {
      if (target) setSpawnTarget(target);
      setCurrentView('GAME');
  };

  const handleSitToggle = (isSitting: boolean, roomId?: string) => {
      if (isSitting && roomId === 'meeting-room') {
          setIsSittingInMeeting(true);
      } else {
          setIsSittingInMeeting(false);
          setShowAINotesOverlay(false); // Close overly if standing up
      }
  };

  if (currentView === 'DASHBOARD') {
      return <Dashboard onEnterGame={handleEnterGame} />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* Game Layer */}
      <div className="absolute inset-0 z-0">
      {/* Game Layer */}
      <div className="absolute inset-0 z-0">
        <PhaserGame spawnTarget={spawnTarget} onSitToggle={handleSitToggle} />
      </div>
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
                <div className={`w-40 h-28 bg-gray-800 rounded-lg border-2 ${isSpeaking ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'border-blue-500'} overflow-hidden relative shadow-lg transition-all duration-200`}>
                    {isCamOn ? (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
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

                    {/* AI Notes Button (Conditionally Rendered) */}
                    {isSittingInMeeting && (
                        <button 
                            onClick={() => setShowAINotesOverlay(!showAINotesOverlay)}
                            className={`p-4 rounded-full transition-all animate-fade-in mx-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] ${showAINotesOverlay ? 'bg-purple-500 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105'}`}
                            title="Activate AI Notes"
                        >
                            ✨ AI Notes
                        </button>
                    )}

                    <button 
                        onClick={handleLeaveGame}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold ml-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                        Leave
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

      {/* AI Notes Overlay */}
      {showAINotesOverlay && (
          <div className="absolute right-8 top-24 bottom-24 w-[500px] z-50 animate-slide-in-right pointer-events-auto">
               <div className="h-full bg-[#0a0a16]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                   <div className="flex justify-between items-center p-4 border-b border-white/10">
                       <h3 className="font-bold text-white flex items-center gap-2">
                           ✨ Meeting Notes
                           <span className="text-[10px] bg-red-500 px-2 rounded-full animate-pulse">Recording</span>
                       </h3>
                       <button onClick={() => setShowAINotesOverlay(false)} className="text-gray-400 hover:text-white">✕</button>
                   </div>
                   <div className="flex-1 overflow-hidden p-2">
                       <div className="p-4 text-gray-300 text-sm">
                           <p className="mb-4">AI is listening to the meeting...</p>
                           <div className="space-y-3">
                               <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                   <span className="text-pink-400 text-xs font-bold">00:01</span>
                                   <p>Discussion started about the new game features.</p>
                               </div>
                               <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                   <span className="text-pink-400 text-xs font-bold">00:45</span>
                                   <p>Agreed to focus on the sitting mechanic first.</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
          </div>
      )}
    </main>
  );
}
