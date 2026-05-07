import { create } from 'zustand';

export interface HadithCollection {
  id: string;
  name: string;
  slug: string;
}

export interface HadithBook {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string | null;
  writerDeath: string;
  bookSlug: string;
}

export interface HadithChapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

export interface HadithItem {
  id: number;
  hadithNumber: string;
  englishNarrator: string | null;
  hadithEnglish: string | null;
  hadithUrdu: string | null;
  urduNarrator: string | null;
  hadithArabic: string | null;
  headingArabic: string | null;
  headingUrdu: string | null;
  headingEnglish: string | null;
  chapterId: string;
  bookSlug: string;
  volume: string;
  status: string;
  book: HadithBook;
  chapter: HadithChapter;
}

export interface HadithResponse {
  current_page: number;
  data: HadithItem[];
  last_page: number;
  total: number;
}

interface HadithState {
  collections: HadithCollection[];
  activeCollectionId: string | null;
  activeHadithData: HadithResponse | null;
  isLoadingHadiths: boolean;
  isLoadingMore: boolean;
  searchQuery: string;
  
  setCollections: (collections: HadithCollection[]) => void;
  setActiveCollectionId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsLoadingHadiths: (loading: boolean) => void;
  
  fetchCollectionData: (id: string, page?: number, search?: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const API_KEY = '$2y$10$NNjpo1NFuYK1PInFLICucGH157hfEK3wDROSsVmYSfzRpO3ijNu';

export const useHadithStore = create<HadithState>((set, get) => ({
  collections: [
    { id: 'sahih-bukhari', slug: 'sahih-bukhari', name: 'Sahih Bukhari' },
    { id: 'sahih-muslim', slug: 'sahih-muslim', name: 'Sahih Muslim' },
    { id: 'al-tirmidhi', slug: 'al-tirmidhi', name: 'Jami\' Al-Tirmidhi' },
    { id: 'abu-dawood', slug: 'abu-dawood', name: 'Sunan Abu Dawood' },
    { id: 'ibn-e-majah', slug: 'ibn-e-majah', name: 'Sunan Ibn-e-Majah' },
    { id: 'sunan-nasai', slug: 'sunan-nasai', name: 'Sunan An-Nasa`i' },
    { id: 'mishkat', slug: 'mishkat', name: 'Mishkat Al-Masabih' },
  ],
  activeCollectionId: null,
  activeHadithData: null,
  isLoadingHadiths: false,
  isLoadingMore: false,
  searchQuery: '',
  
  setCollections: (collections) => set({ collections }),
  setActiveCollectionId: (id) => set({ activeCollectionId: id, activeHadithData: null, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoadingHadiths: (loading) => set({ isLoadingHadiths: loading }),
  
  fetchCollectionData: async (id: string, page = 1, search = '') => {
    if (page === 1) {
      set({ isLoadingHadiths: true, activeCollectionId: id });
    } else {
      set({ isLoadingMore: true });
    }
    
    try {
      let url = `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}&book=${id}&paginate=25&page=${page}`;
      if (search) {
        url += `&hadithEnglish=${encodeURIComponent(search)}`;
      }
      
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.status === 200 && json.hadiths) {
        if (page === 1) {
          set({ activeHadithData: json.hadiths, isLoadingHadiths: false, isLoadingMore: false });
        } else {
          const currentData = get().activeHadithData;
          if (currentData) {
            set({ 
              activeHadithData: {
                ...json.hadiths,
                data: [...currentData.data, ...json.hadiths.data]
              },
              isLoadingMore: false 
            });
          }
        }
      } else {
        set({ isLoadingHadiths: false, isLoadingMore: false });
      }
    } catch (e) {
      console.error("Failed to load hadith collection", e);
      set({ isLoadingHadiths: false, isLoadingMore: false });
    }
  },
  
  loadMore: async () => {
    const { activeCollectionId, activeHadithData, isLoadingMore, searchQuery } = get();
    if (!activeCollectionId || !activeHadithData || isLoadingMore) return;
    
    if (activeHadithData.current_page < activeHadithData.last_page) {
      await get().fetchCollectionData(activeCollectionId, activeHadithData.current_page + 1, searchQuery);
    }
  }
}));
