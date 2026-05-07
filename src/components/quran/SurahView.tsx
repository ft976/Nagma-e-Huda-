"use client";

import React, { useEffect, useRef } from 'react';
import { Play, Pause, Bookmark, Volume2, Share2, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useAudioStore } from '@/stores/useAudioStore';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { MergedAyah } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IMAGES = [
  'kaaba_tawaf.png', 'madinah_umbrellas.png', 'makkah_night.png', 
  'madinah_interior.png', 'architecture.png', 'calligraphy.png', 
  'courtyard.png', 'sunrise.png', 'geometric.png', 'manuscript.png'
];

interface AyahCardProps {
  ayah: MergedAyah;
  surahNumber: number;
  surahName: string;
  isActive: boolean;
}

export const AyahCard: React.FC<AyahCardProps> = ({ ayah, surahNumber, surahName, isActive }) => {
  const { isPlaying, setPlaying, setCurrentAyah, setPlaybackMode, showTranslation } = useAudioStore();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  const toggleBookmark = () => {
    if (isBookmarked(surahNumber, ayah.numberInSurah)) {
      removeBookmark(surahNumber, ayah.numberInSurah);
    } else {
      addBookmark({ ...ayah, surahNumber, surahName });
    }
  };

  const playThisAyah = () => {
    setPlaybackMode('ayah-by-ayah');
    setCurrentAyah(ayah.numberInSurah);
    setPlaying(true);
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-3xl p-6 md:p-8 mb-6 transition-all duration-500",
        isActive ? "ring-2 ring-brand-accent shadow-xl shadow-brand-accent/5" : "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center font-mono text-stone-400 text-sm">
            {ayah.numberInSurah}
          </div>
          <div className="flex gap-1">
            <button 
              onClick={playThisAyah}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isActive && isPlaying ? "bg-brand-accent text-white" : "bg-stone-50 text-stone-500 hover:bg-brand-accent/10 hover:text-brand-accent"
              )}
            >
              {isActive && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleBookmark}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isBookmarked(surahNumber, ayah.numberInSurah) ? "bg-red-50 text-red-500" : "bg-stone-50 text-stone-400 hover:text-red-500"
            )}
          >
            <Bookmark size={18} fill={isBookmarked(surahNumber, ayah.numberInSurah) ? "currentColor" : "none"} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:text-brand-accent transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="rtl font-amiri text-4xl md:text-5xl text-stone-900 leading-[2] mb-10 text-right">
        {ayah.text}
      </div>

      <AnimatePresence>
        {showTranslation && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-stone-100 text-stone-600 font-inter text-lg leading-relaxed md:pr-12">
              {ayah.translation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SurahView = () => {
  const { activeSurah, activeAyahs, isLoading, setActiveSurah } = useAppStore();
  const { currentAyahNumber, setPlaying, setPlaybackMode, setCurrentAyah } = useAudioStore();

  useEffect(() => {
    if (activeSurah) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSurah]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 animate-pulse font-inter">Preparing the revelation...</p>
      </div>
    );
  }

  if (!activeSurah) return null;

  const playFullSurah = () => {
    setPlaybackMode('full-surah');
    setPlaying(true);
  };

  const currentImage = `/assets/images/${IMAGES[activeSurah.number % IMAGES.length]}`;

  return (
    <div className="flex-1 overflow-auto bg-brand-background pb-[180px] md:pb-32 relative">
      {/* Surah Header with Background */}
      <div className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
         {/* Top Navigation Control */}
         <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-start">
           <button 
             onClick={() => setActiveSurah(null)}
             className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/30 active:scale-95 transition-all shadow-lg"
           >
             <ArrowLeft size={24} />
           </button>
         </div>

         {/* Adaptive Header Background */}
         <div className="absolute inset-0 z-0">
            <img 
              src={currentImage} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] transition-all" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/60 to-transparent" />
         </div>

         <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-4xl py-20"
        >
          <span className="text-white/70 font-mono tracking-[0.4em] uppercase text-xs mb-4 block drop-shadow-md">
            Surah {activeSurah.number}
          </span>
          <h1 className="font-playfair text-5xl md:text-8xl mb-4 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            {activeSurah.englishName}
          </h1>
          <p className="font-amiri text-5xl text-brand-accent mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            {activeSurah.name}
          </p>
          <div className="flex items-center justify-center gap-6 text-white/90 font-inter text-sm mb-12">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              {activeSurah.revelationType}
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              {activeSurah.numberOfAyahs} Verses
            </span>
          </div>

          <button 
            onClick={playFullSurah}
            className="group relative flex items-center gap-3 bg-brand-accent text-white px-10 py-5 rounded-full shadow-2xl hover:shadow-brand-accent/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-accent transition-colors">
              <Play size={20} fill="currentColor" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase">Listen to Revelation</span>
          </button>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-0">
        {/* Bismillah */}
        {activeSurah.number !== 1 && activeSurah.number !== 9 && (
          <div className="font-amiri text-5xl text-stone-900 text-center mb-16 opacity-80 leading-relaxed">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        )}

        {/* Ayahs List */}
        <div className="flex flex-col gap-6">
          {activeAyahs.map((ayah) => (
            <AyahCard 
              key={ayah.number} 
              ayah={ayah} 
              surahNumber={activeSurah.number}
              surahName={activeSurah.englishName}
              isActive={currentAyahNumber === ayah.numberInSurah} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
