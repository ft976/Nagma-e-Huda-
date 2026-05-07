"use client";

import React from 'react';
import { Bookmark, BookOpen, Home, List } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useHadithStore } from '@/stores/useHadithStore';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BottomNav = () => {
  const { mobileTab, setMobileTab, setActiveSurah } = useAppStore();

  const tabs = [
    { id: 'discover', label: 'Home', icon: Home },
    { id: 'surahs', label: 'Surahs', icon: List },
    { id: 'hadith', label: 'Hadith', icon: BookOpen },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark },
  ] as const;

  const handleTabClick = (tabId: 'discover' | 'surahs' | 'hadith' | 'bookmarks') => {
    setMobileTab(tabId);
    if (tabId === 'discover') {
      setActiveSurah(null); // Return to home screen
      useHadithStore.getState().setActiveCollectionId(null);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-white/80 backdrop-blur-xl border-t border-stone-100 px-6 h-[84px] flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = mobileTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="relative flex flex-col items-center gap-1 group"
          >
            <div className={cn(
              "p-2.5 rounded-2xl transition-all duration-300",
              isActive ? "text-brand-accent bg-brand-accent/10" : "text-stone-400"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-brand-accent/5 rounded-2xl blur-md"
                />
              )}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider transition-colors",
              isActive ? "text-brand-accent" : "text-stone-400"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
