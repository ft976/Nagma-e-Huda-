"use client";

import React, { useState, useEffect } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Search, Bookmark, List, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/stores/useAppStore';
import { useAudioStore } from '@/stores/useAudioStore';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { useHadithStore } from '@/stores/useHadithStore';
import { fetchSurahsList, fetchSurahAyahs } from '@/lib/api';
import { Surah } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { 
    surahsList, 
    setSurahsList, 
    activeSurah, 
    setActiveSurah, 
    setActiveAyahs, 
    setIsLoading,
    mobileTab,
    setMobileTab
  } = useAppStore();
  
  const { bookmarks } = useBookmarkStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [desktopTab, setDesktopTab] = useState<'surahs' | 'bookmarks' | 'hadith'>('surahs');

  useEffect(() => {
    const loadSurahs = async () => {
      const list = await fetchSurahsList();
      setSurahsList(list);
    };
    loadSurahs();
  }, [setSurahsList]);

  const handleSurahClick = async (surah: Surah) => {
    useHadithStore.getState().setActiveCollectionId(null);
    setActiveSurah(surah);
    setIsLoading(true);
    try {
      const ayahs = await fetchSurahAyahs(surah.number);
      setActiveAyahs(ayahs);
    } catch (error) {
      console.error("Failed to fetch ayahs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync desktop internal state with mobile tab for consistency if needed, 
  // but for now let's just use mobileTab if it's visible.
  const activeTab = (typeof window !== 'undefined' && window.innerWidth < 768) 
    ? (mobileTab === 'bookmarks' ? 'bookmarks' : mobileTab === 'hadith' ? 'hadith' : 'surahs') 
    : desktopTab;

  const setActiveTab = (tab: 'surahs' | 'bookmarks' | 'hadith') => {
    if (window.innerWidth < 768) {
      setMobileTab(tab);
    } else {
      setDesktopTab(tab);
    }
  };

  const { collections, activeCollectionId, fetchCollectionData } = useHadithStore();

  const handleHadithCollectionClick = async (id: string) => {
    setActiveSurah(null);
    fetchCollectionData(id);
    if (window.innerWidth < 768) {
      // Keep on hadith tab but wait for main view to open
    }
  };

  const filteredSurahs = surahsList.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery)
  );

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside 
        className={cn(
          "w-full md:w-96 bg-white flex flex-col h-full",
          "md:border-r md:border-stone-100"
        )}
      >
        {/* Header */}
        <button 
          onClick={() => {
             setActiveSurah(null);
             useHadithStore.getState().setActiveCollectionId(null);
             if (window.innerWidth < 768) {
               setMobileTab('discover');
             }
          }}
          className="w-full p-6 md:p-8 border-b border-stone-50 flex items-center justify-between hover:bg-stone-50/50 transition-colors text-left focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
              <span className="font-playfair text-xl font-bold text-brand-accent">T03</span>
            </div>
            <h1 className="font-playfair text-xl font-bold text-stone-900">Tafseel03</h1>
          </div>
        </button>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-2">
          <button 
            onClick={() => setActiveTab('surahs')}
            className={cn(
              "flex-1 py-2 px-2 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs font-medium",
              activeTab === 'surahs' ? "bg-brand-accent text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            )}
          >
            <List size={14} />
            <span>Surahs</span>
          </button>
          <button 
            onClick={() => setActiveTab('hadith')}
            className={cn(
              "flex-1 py-2 px-2 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs font-medium",
              activeTab === 'hadith' ? "bg-brand-accent text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            )}
          >
            <BookOpen size={14} />
            <span>Hadith</span>
          </button>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              "flex-1 py-2 px-2 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs font-medium",
              activeTab === 'bookmarks' ? "bg-brand-accent text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            )}
          >
            <Bookmark size={14} />
            <span>Saved</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-brand-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-accent/20 outline-none text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* List content */}
        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="h-full w-full p-4 pb-[180px] md:pb-4">
            <div className="flex flex-col gap-2">
              {activeTab === 'surahs' ? (
                filteredSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => handleSurahClick(surah)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group",
                      activeSurah?.number === surah.number 
                        ? "bg-brand-accent/5 ring-1 ring-brand-accent/20" 
                        : "hover:bg-stone-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-colors",
                      activeSurah?.number === surah.number 
                        ? "bg-brand-accent text-white" 
                        : "bg-stone-100 text-stone-500 group-hover:bg-brand-accent/10 group-hover:text-brand-accent"
                    )}>
                      {surah.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-stone-900">{surah.englishName}</span>
                        <span className="font-amiri text-lg text-brand-accent leading-none">{surah.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{surah.revelationType} • {surah.numberOfAyahs} Ayahs</span>
                        <span>{surah.englishNameTranslation}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : activeTab === 'hadith' ? (
                filteredCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleHadithCollectionClick(collection.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group",
                      !activeSurah && activeCollectionId === collection.id 
                        ? "bg-brand-accent/5 ring-1 ring-brand-accent/20" 
                        : "hover:bg-stone-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-colors",
                      !activeSurah && activeCollectionId === collection.id 
                        ? "bg-brand-accent text-white" 
                        : "bg-stone-100 text-stone-500 group-hover:bg-brand-accent/10 group-hover:text-brand-accent"
                    )}>
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-stone-900 text-sm block mb-1">{collection.name}</span>
                      <span className="text-xs text-stone-500 line-clamp-1 opacity-70 cursor-pointer">{collection.id}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col gap-2">
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                      <div className="flex flex-col items-center gap-4">
                        <Bookmark size={32} strokeWidth={1.5} />
                        <p className="text-sm">No saved verses yet.</p>
                      </div>
                    </div>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <button
                        key={`${bookmark.surahNumber}-${bookmark.numberInSurah}`}
                        onClick={async () => {
                          const surah = surahsList.find(s => s.number === bookmark.surahNumber);
                          if (surah) {
                            await handleSurahClick(surah);
                            useAudioStore.getState().setCurrentAyah(bookmark.numberInSurah);
                          }
                        }}
                        className="w-full text-left p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-brand-accent uppercase tracking-wider">
                            {bookmark.surahName} • Verse {bookmark.numberInSurah}
                          </span>
                          <Bookmark size={14} className="text-brand-accent fill-brand-accent" />
                        </div>
                        <p className="rtl font-amiri text-lg text-stone-900 line-clamp-1 mb-1">{bookmark.text}</p>
                        <p className="text-[10px] text-stone-500 line-clamp-1 italic">{bookmark.translation}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-stone-100 transition-colors duration-[160ms] ease-out hover:bg-stone-200 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1.5" orientation="vertical">
            <ScrollArea.Thumb className="flex-1 bg-stone-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </aside>
    </>
  );
};
