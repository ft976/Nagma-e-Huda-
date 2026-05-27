"use client";

import React, { useEffect } from 'react';
import { useHadithStore } from '@/stores/useHadithStore';
import { useAppStore } from '@/stores/useAppStore';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const HadithView = () => {
  const { 
    activeHadithData, 
    isLoadingHadiths, 
    isLoadingMore, 
    activeCollectionId, 
    collections, 
    searchQuery, 
    setSearchQuery, 
    fetchCollectionData, 
    loadMore 
  } = useHadithStore();
  const { setActiveSurah, setMobileTab } = useAppStore();
  
  // Debounced search
  useEffect(() => {
    if (activeCollectionId) {
      const handler = setTimeout(() => {
        // Only fetch if it's the first page of a new search
        fetchCollectionData(activeCollectionId, 1, searchQuery);
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [searchQuery, activeCollectionId, fetchCollectionData]);

  if (isLoadingHadiths && !activeHadithData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
        <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 animate-pulse font-inter">Loading Hadith Collection...</p>
      </div>
    );
  }

  if (!activeHadithData || !activeCollectionId) return null;

  const activeCollection = collections.find(c => c.id === activeCollectionId);
  const collectionName = activeCollection?.name || 'Hadith Collection';

  return (
    <div className="flex-1 overflow-auto bg-brand-background pb-[180px] md:pb-6 relative h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-stone-100 z-30 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
             onClick={() => {
               useHadithStore.getState().setActiveCollectionId(null);
               if (window.innerWidth < 768) {
                 setMobileTab('hadith');
               }
             }}
             className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors focus:outline-none"
           >
             <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-playfair text-2xl font-bold text-stone-900">{collectionName}</h1>
            <p className="text-xs font-mono text-stone-500">{activeHadithData.total.toLocaleString()} Hadiths Total</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-brand-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search hadiths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-accent/20 outline-none text-stone-900 placeholder:text-stone-400"
            />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto w-full flex-1">
        <div className="flex flex-col gap-6">
          {activeHadithData.data.length === 0 ? (
             <p className="text-center text-stone-500 py-12">No hadiths found.</p>
          ) : (
            activeHadithData.data.map((hadith) => (
              <div key={hadith.id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-50 hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4 border-b border-stone-50 pb-4">
                   <span className="bg-stone-50 text-stone-500 font-mono text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                     Hadith {hadith.hadithNumber}
                   </span>
                   {hadith.chapter && (
                     <span className="text-xs text-stone-500 font-mono text-right max-w-[200px] truncate" title={hadith.chapter.chapterEnglish}>
                       {hadith.chapter.chapterEnglish}
                     </span>
                   )}
                 </div>
                 
                 {hadith.englishNarrator && (
                   <p className="font-semibold text-stone-700 text-sm mb-2">{hadith.englishNarrator}</p>
                 )}
                 
                 <p className="font-inter text-stone-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap mb-4">
                   {hadith.hadithEnglish || "English translation not available."}
                 </p>
                 
                 {hadith.hadithArabic && (
                   <div className="mt-4 pt-4 border-t border-stone-50">
                     <p className="font-amiri text-xl leading-loose text-right text-stone-900 dir-rtl" dir="rtl">
                       {hadith.hadithArabic}
                     </p>
                   </div>
                 )}
                 
                 {hadith.status && (
                   <div className="mt-4 pt-4 border-t border-stone-50 flex flex-wrap gap-2">
                     <span className={cn(
                       "text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md",
                       hadith.status.toLowerCase().includes("sahih") ? "bg-green-50 text-green-700" :
                       hadith.status.toLowerCase().includes("daif") || hadith.status.toLowerCase().includes("weak") ? "bg-red-50 text-red-700" :
                       "bg-stone-100 text-stone-600"
                     )}>
                       {hadith.status}
                     </span>
                   </div>
                 )}
              </div>
            ))
          )}
          
          {activeHadithData.current_page < activeHadithData.last_page && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => loadMore()}
                disabled={isLoadingMore}
                className="bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent transition-colors py-3 px-8 rounded-full font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isLoadingMore && <Loader2 className="animate-spin" size={16} />}
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

