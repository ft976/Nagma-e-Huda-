import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MergedAyah } from '@/lib/types';

interface Bookmark extends MergedAyah {
  surahNumber: number;
  surahName: string;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, bookmark]
      })),
      removeBookmark: (surahNumber, ayahNumber) => set((state) => ({
        bookmarks: state.bookmarks.filter(
          (b) => !(b.surahNumber === surahNumber && b.numberInSurah === ayahNumber)
        )
      })),
      isBookmarked: (surahNumber, ayahNumber) => {
        return get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.numberInSurah === ayahNumber
        );
      },
    }),
    {
      name: 'tafseel-bookmarks',
    }
  )
);
