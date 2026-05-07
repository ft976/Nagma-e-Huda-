import { create } from 'zustand';
import { Surah, MergedAyah } from '@/lib/types';

interface AppState {
  surahsList: Surah[];
  activeSurah: Surah | null;
  activeAyahs: MergedAyah[];
  isLoading: boolean;
  mobileTab: 'discover' | 'surahs' | 'hadith' | 'bookmarks';
  setSurahsList: (list: Surah[]) => void;
  setActiveSurah: (surah: Surah | null) => void;
  setActiveAyahs: (ayahs: MergedAyah[]) => void;
  setIsLoading: (loading: boolean) => void;
  setMobileTab: (tab: 'discover' | 'surahs' | 'hadith' | 'bookmarks') => void;
}

export const useAppStore = create<AppState>((set) => ({
  surahsList: [],
  activeSurah: null,
  activeAyahs: [],
  isLoading: false,
  mobileTab: 'discover',
  setSurahsList: (list) => set({ surahsList: list }),
  setActiveSurah: (surah) => set({ activeSurah: surah }),
  setActiveAyahs: (ayahs) => set({ activeAyahs: ayahs }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setMobileTab: (tab) => set({ mobileTab: tab }),
}));
