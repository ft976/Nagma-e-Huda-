"use client";

import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, Settings, ChevronUp, ChevronDown, 
  Heart, Languages, Gauge, Share2
} from 'lucide-react';
import { useAudioStore } from '@/stores/useAudioStore';
import { useAppStore } from '@/stores/useAppStore';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const IMAGES = [
  'kaaba_tawaf.png', 'madinah_umbrellas.png', 'makkah_night.png', 
  'madinah_interior.png', 'architecture.png', 'calligraphy.png', 
  'courtyard.png', 'sunrise.png', 'geometric.png', 'manuscript.png'
];

export const PlayerBar = () => {
  const audioRef = useAudioPlayer();
  const { 
    isPlaying, setPlaying, 
    currentAyahNumber, setCurrentAyah, 
    volume, setVolume, 
    reciter, setReciter,
    duration, currentTime,
    playbackSpeed, setPlaybackSpeed,
    showTranslation, setShowTranslation
  } = useAudioStore();
  
  const { activeSurah, activeAyahs } = useAppStore();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeSurah) return null;

  const currentAyah = activeAyahs.find(a => a.numberInSurah === currentAyahNumber);
  const currentImage = `/assets/images/${IMAGES[activeSurah.number % IMAGES.length]}`;

  const handleProgressChange = (val: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val[0];
    }
  };

  const handleNext = () => {
    if (currentAyahNumber < activeSurah.numberOfAyahs) {
      setCurrentAyah(currentAyahNumber + 1);
    }
  };

  const handlePrev = () => {
    if (currentAyahNumber > 1) {
      setCurrentAyah(currentAyahNumber - 1);
    }
  };

  const toggleBookmark = () => {
    if (currentAyah) {
      if (isBookmarked(activeSurah.number, currentAyahNumber)) {
        removeBookmark(activeSurah.number, currentAyahNumber);
      } else {
        addBookmark({ ...currentAyah, surahNumber: activeSurah.number, surahName: activeSurah.englishName });
      }
    }
  };

  return (
    <>
      {/* Immersive Mobile Slide-up (Upper Slide) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[75] bg-brand-background flex flex-col md:hidden"
          >
            {/* Background Blur Image */}
            <div className="absolute inset-0 z-0 opacity-20 blur-3xl scale-150 bg-brand-background">
              <img src={currentImage} className="w-full h-full object-cover mix-blend-overlay" alt="" />
            </div>

            <div className="relative z-10 flex flex-col h-full bg-gradient-to-b from-black/5 to-white/95">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 active:scale-95 transition-transform"
                >
                  <ChevronDown size={32} />
                </button>
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-stone-500">
                  Now Playing
                </span>
                <button className="w-10 h-10 flex items-center justify-center text-stone-600 active:scale-95 transition-transform">
                  <Share2 size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col px-6 pb-6 mt-4 overflow-y-auto no-scrollbar">
                {/* Artwork */}
                <motion.div 
                  layoutId="player-art"
                  animate={{ 
                    scale: isPlaying ? 1.02 : 0.98,
                    boxShadow: isPlaying ? "0 30px 60px -15px rgba(180,142,75,0.4)" : "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)"
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  className="w-full max-w-[340px] aspect-square mx-auto bg-white rounded-3xl mb-8 flex items-center justify-center overflow-hidden ring-1 ring-black/5 flex-shrink-0"
                >
                  <img src={currentImage} alt="Surah Cover" className="w-full h-full object-cover" />
                </motion.div>
                
                {/* Info & Bookmark Row */}
                <div className="flex items-center justify-between mb-8 w-full max-w-[340px] mx-auto flex-shrink-0">
                  <div className="flex flex-col gap-1 items-start pr-4">
                    <h3 className="font-playfair text-3xl font-bold text-stone-900 line-clamp-1">
                      {activeSurah.englishName}
                    </h3>
                    <p className="font-amiri text-xl text-stone-500 line-clamp-1">
                      Surah {activeSurah.number} • Verse {currentAyahNumber}
                    </p>
                  </div>
                  <button 
                    onClick={toggleBookmark}
                    className={cn("p-2 transition-transform active:scale-75 flex-shrink-0", isBookmarked(activeSurah.number, currentAyahNumber) ? "text-red-500" : "text-stone-300")}
                  >
                    <Heart size={32} fill={isBookmarked(activeSurah.number, currentAyahNumber) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Scrubber */}
                <div className="w-full max-w-[340px] mx-auto space-y-3 mb-6 flex-shrink-0">
                  <Slider.Root 
                    className="relative flex items-center select-none touch-none w-full h-8 group"
                    value={[currentTime]}
                    max={duration || 100}
                    onValueChange={handleProgressChange}
                  >
                    <Slider.Track className="bg-stone-200/60 relative grow rounded-full h-1.5 overflow-hidden transition-all group-active:h-2.5">
                      <Slider.Range className="absolute bg-stone-900 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="hidden group-active:block w-4 h-4 bg-white border border-stone-200 shadow-md rounded-full outline-none" />
                  </Slider.Root>
                  <div className="flex justify-between text-[11px] font-mono font-medium text-stone-400 px-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Audio Controls */}
                <div className="w-full max-w-[340px] mx-auto flex items-center justify-between mb-8 flex-shrink-0">
                   {/* Speed Dropdown */}
                   <DropdownMenu.Root>
                     <DropdownMenu.Trigger asChild>
                       <button className={cn("p-2 transition-colors active:scale-90 flex flex-col items-center gap-1", playbackSpeed !== 1 ? "text-brand-accent" : "text-stone-400")}>
                         <Gauge size={24} />
                         <span className="text-[9px] font-mono font-bold leading-none">{playbackSpeed}x</span>
                       </button>
                     </DropdownMenu.Trigger>
                     <DropdownMenu.Portal>
                       <DropdownMenu.Content className="min-w-[140px] bg-white rounded-2xl p-2 shadow-2xl border border-stone-100 z-[80] animate-in fade-in zoom-in-95 mb-2">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                            <DropdownMenu.Item 
                             key={speed}
                             onClick={() => setPlaybackSpeed(speed)}
                             className={cn(
                               "px-3 py-2.5 rounded-xl text-xs font-mono font-bold outline-none cursor-pointer flex items-center justify-between",
                               playbackSpeed === speed ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-stone-50"
                             )}
                            >
                              {speed}x
                              {playbackSpeed === speed && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />}
                            </DropdownMenu.Item>
                          ))}
                       </DropdownMenu.Content>
                     </DropdownMenu.Portal>
                   </DropdownMenu.Root>

                   <button onClick={handlePrev} className="text-stone-900 active:scale-75 transition-transform p-2"><SkipBack size={36} fill="currentColor" /></button>
                   
                   <button 
                     onClick={() => setPlaying(!isPlaying)}
                     className="w-20 h-20 bg-stone-900 text-white rounded-full flex items-center justify-center active:scale-95 transition-all shadow-xl"
                   >
                     {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1.5" />}
                   </button>
                   
                   <button onClick={handleNext} className="text-stone-900 active:scale-75 transition-transform p-2"><SkipForward size={36} fill="currentColor" /></button>

                   {/* Reciter Toggle */}
                   <DropdownMenu.Root>
                     <DropdownMenu.Trigger asChild>
                       <button className={cn("p-2 transition-colors active:scale-90 flex flex-col items-center gap-1", reciter === 'Alafasy' ? "text-stone-400" : "text-brand-accent")}>
                         <Settings size={24} />
                         <span className="text-[9px] font-mono font-bold leading-none">{reciter === 'Alafasy' ? 'Mishary' : 'Sudais'}</span>
                       </button>
                     </DropdownMenu.Trigger>
                     <DropdownMenu.Portal>
                       <DropdownMenu.Content className="min-w-[180px] bg-white rounded-2xl p-2 shadow-xl border border-stone-100 z-[80] animate-in fade-in zoom-in-95 mb-2">
                          <DropdownMenu.Item onClick={() => setReciter('Alafasy')} className={cn("px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer", reciter === 'Alafasy' ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-stone-50")}>
                            Mishary Alafasy
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => setReciter('Sudais')} className={cn("px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer", reciter === 'Sudais' ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-stone-50")}>
                            Abdurrahman As-Sudais
                          </DropdownMenu.Item>
                       </DropdownMenu.Content>
                     </DropdownMenu.Portal>
                   </DropdownMenu.Root>
                </div>

                {/* Lyrics Section (Spotify Style Card at Bottom) */}
                <div 
                  className="w-full max-w-[340px] mx-auto bg-stone-900/5 rounded-3xl p-6 relative overflow-hidden flex-shrink-0 cursor-pointer active:scale-[0.98] transition-all" 
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                   <div className="flex items-center justify-between mb-4">
                     <p className="font-bold text-xs font-mono uppercase tracking-widest text-stone-500">Verses</p>
                     <Languages size={18} className={cn("transition-colors", showTranslation ? "text-brand-accent" : "text-stone-400")} />
                   </div>
                   
                   <p className="rtl font-amiri text-3xl leading-relaxed text-stone-900 break-words mb-4" dir="rtl">
                     {currentAyah?.text}
                   </p>
                   
                   <AnimatePresence>
                     {showTranslation && currentAyah?.translation && (
                       <motion.p 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="text-sm font-inter text-stone-600 border-t border-stone-900/10 pt-4"
                       >
                         {currentAyah.translation}
                       </motion.p>
                     )}
                   </AnimatePresence>
                </div>
                {/* Spacer block to allow smooth scrolling up */}
                <div className="h-12 w-full flex-shrink-0" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bar (Spotify Structure) */}
      <div className={cn(
        "fixed left-0 right-0 z-[60] bg-white/95 backdrop-blur-xl border-t border-stone-100 flex items-center group transition-all duration-300",
        "bottom-[84px] h-[76px] px-4 md:bottom-0 md:h-28 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
      )}>
        {/* Left: Now Playing Info */}
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-[320px] flex-shrink-0 min-w-0">
          <div 
            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
             <motion.img layoutId="player-art" src={currentImage} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex flex-col min-w-0 flex-1 cursor-pointer" onClick={() => setIsExpanded(true)}>
            <h4 className="font-semibold text-stone-900 truncate text-sm md:text-base">{activeSurah.englishName}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs text-stone-500 font-mono">Verse {currentAyahNumber}</span>
              <span className="text-stone-200 hidden md:inline">•</span>
              <span className="text-[10px] md:text-xs text-stone-500 truncate hidden md:inline">{reciter === 'Alafasy' ? 'Mishary Alafasy' : 'As-Sudais'}</span>
            </div>
          </div>
          
          {/* Mobile Play/Pause - Visible only on mobile mini bar */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleBookmark(); }}
              className={cn("p-2", isBookmarked(activeSurah.number, currentAyahNumber) ? "text-brand-accent" : "text-stone-300")}
            >
              <Heart size={20} fill={isBookmarked(activeSurah.number, currentAyahNumber) ? "currentColor" : "none"} />
            </button>
            <button 
               onClick={(e) => { e.stopPropagation(); setPlaying(!isPlaying); }}
               className="w-11 h-11 bg-stone-900 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
             >
               {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
             </button>
          </div>

          <button 
            onClick={toggleBookmark}
            className={cn("ml-2 transition-colors hidden md:block", isBookmarked(activeSurah.number, currentAyahNumber) ? "text-brand-accent" : "text-stone-300 hover:text-stone-600")}
          >
            <Heart size={18} fill={isBookmarked(activeSurah.number, currentAyahNumber) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Center: Controls & Progress */}
        <div className="hidden md:flex flex-1 flex-col items-center max-w-[600px] mx-auto px-4">
          <div className="flex items-center gap-6 mb-1.5">
             <button onClick={handlePrev} className="text-stone-400 hover:text-stone-900 transition-colors"><SkipBack size={20} fill="currentColor" /></button>
             <button 
               onClick={() => setPlaying(!isPlaying)}
               className="w-10 h-10 md:w-12 md:h-12 bg-stone-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
             >
               {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
             </button>
             <button onClick={handleNext} className="text-stone-400 hover:text-stone-900 transition-colors"><SkipForward size={20} fill="currentColor" /></button>
          </div>
          
          <div className="flex items-center gap-3 w-full">
            <span className="text-[10px] font-mono text-stone-400 w-10 text-right">{formatTime(currentTime)}</span>
            <Slider.Root 
              className="relative flex items-center select-none touch-none w-full h-5 group/slider"
              value={[currentTime]}
              max={duration || 100}
              onValueChange={handleProgressChange}
            >
              <Slider.Track className="bg-stone-100 relative grow rounded-full h-1 group-hover/slider:h-1.5 transition-all">
                <Slider.Range className="absolute bg-brand-accent rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="hidden group-hover/slider:block w-3 h-3 bg-white border-2 border-brand-accent rounded-full outline-none shadow-md" />
            </Slider.Root>
            <span className="text-[10px] font-mono text-stone-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Utilities */}
        <div className="hidden md:flex items-center gap-3 md:gap-5 w-[240px] md:w-[320px] flex-shrink-0 justify-end">
          {/* Translation Toggle */}
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className={cn(
              "p-2 rounded-xl transition-all",
              showTranslation ? "bg-brand-accent/10 text-brand-accent" : "text-stone-400 hover:bg-stone-50"
            )}
            title="Toggle Translation"
          >
            <Languages size={18} />
          </button>

          {/* Speed Control */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                className={cn(
                  "p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono font-bold",
                  playbackSpeed !== 1 ? "bg-brand-accent/10 text-brand-accent" : "text-stone-400 hover:bg-stone-50"
                )}
              >
                <Gauge size={18} />
                <span className="hidden sm:inline">{playbackSpeed}x</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="min-w-[120px] bg-white rounded-2xl p-2 shadow-2xl border border-stone-100 z-[75] animate-in fade-in zoom-in-95">
                 {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                   <DropdownMenu.Item 
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-mono outline-none cursor-pointer flex items-center justify-between",
                      playbackSpeed === speed ? "bg-brand-accent/10 text-brand-accent" : "hover:bg-stone-50"
                    )}
                   >
                     {speed}x
                     {playbackSpeed === speed && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />}
                   </DropdownMenu.Item>
                 ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-3 w-32 group/vol">
            <Volume2 size={18} className="text-stone-400 group-hover/vol:text-stone-600 transition-colors" />
            <Slider.Root 
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[volume * 100]}
              max={100}
              onValueChange={(val) => setVolume(val[0] / 100)}
            >
              <Slider.Track className="bg-stone-100 relative grow rounded-full h-1">
                <Slider.Range className="absolute bg-brand-accent rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="hidden group-hover/vol:block w-3 h-3 bg-white border-2 border-brand-accent rounded-full outline-none shadow-sm" />
            </Slider.Root>
          </div>
        </div>
      </div>
    </>
  );
};
