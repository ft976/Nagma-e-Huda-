/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { SurahView } from "@/components/quran/SurahView";
import { HadithView } from "@/components/quran/HadithView";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAppStore } from "@/stores/useAppStore";
import { useHadithStore } from "@/stores/useHadithStore";
import { motion, AnimatePresence } from "motion/react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    reference: "Surah Ar-Ra'd 13:28"
  },
  {
    text: "And We have certainly made the Quran easy for remembrance.",
    reference: "Surah Al-Qamar 54:17"
  },
  {
    text: "Read! In the name of your Lord who created.",
    reference: "Surah Al-Alaq 96:1"
  }
];

export default function App() {
  const { activeSurah, mobileTab } = useAppStore();
  const { activeCollectionId } = useHadithStore();
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white relative pt-1">
      {/* Premium Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-accent z-[100]" />

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block border-r border-stone-100 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeSurah && !activeCollectionId && mobileTab === 'discover' ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 relative flex flex-col items-center justify-center text-center p-6 overflow-hidden"
            >
              {/* Hero Background */}
              <div className="absolute inset-0 z-0 bg-stone-100">
                <motion.img
                  src="/assets/images/architecture.png"
                  alt="Spiritual Background"
                  className="w-full h-full object-cover opacity-60 origin-center"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-brand-background/40 mix-blend-overlay" />
              </div>

              {/* Welcome Content */}
              <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-4xl md:text-7xl font-playfair text-stone-900 mb-6 drop-shadow-sm tracking-tight text-center">
                    Tafseel03
                  </h1>

                  {/* Motivational Quotes */}
                  <div className="h-24 md:h-32 flex flex-col items-center justify-center mb-12">
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={quoteIndex}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         transition={{ duration: 1 }}
                         className="text-center"
                       >
                         <p className="text-lg md:text-2xl text-stone-900 font-playfair italic max-w-2xl leading-relaxed mb-3 drop-shadow-md">
                           "{MOTIVATIONAL_QUOTES[quoteIndex].text}"
                         </p>
                         <p className="text-[10px] md:text-xs font-mono text-stone-400 uppercase tracking-widest opacity-60">
                           {MOTIVATIONAL_QUOTES[quoteIndex].reference}
                         </p>
                       </motion.div>
                     </AnimatePresence>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-center gap-6">
                    <div className="w-16 h-0.5 bg-brand-accent/30 rounded-full mb-2" />
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-[0.4em] opacity-80">
                      Begin Your Journey
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : !activeSurah && !activeCollectionId && (mobileTab === 'surahs' || mobileTab === 'bookmarks' || mobileTab === 'hadith') ? (
             <motion.div 
               key="mobile-drawer"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="md:hidden flex-1 h-full w-full bg-white"
             >
                <Sidebar />
             </motion.div>
          ) : activeCollectionId && !activeSurah ? (
             <motion.div 
               key="hadith-view"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex-1 flex flex-col min-h-0 h-full w-full"
             >
               <HadithView />
             </motion.div>
          ) : (
            <motion.div 
              key="surah"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col min-h-0 h-full"
            >
              <SurahView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Player Bar - Adjusted for mobile BottomNav */}
        <div className="pb-[84px] md:pb-0">
           <PlayerBar />
        </div>
        
        {/* Mobile Navigation */}
        <BottomNav />
      </main>
    </div>
  );
}
