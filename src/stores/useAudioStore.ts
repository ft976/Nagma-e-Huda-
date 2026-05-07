import { create } from 'zustand';
import { Reciter, PlaybackMode } from '@/lib/types';

interface AudioState {
  currentAyahNumber: number;
  isPlaying: boolean;
  volume: number;
  reciter: Reciter;
  playbackMode: PlaybackMode;
  audioUrl: string;
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  showTranslation: boolean;
  
  setPlaying: (playing: boolean) => void;
  setCurrentAyah: (number: number) => void;
  setVolume: (volume: number) => void;
  setReciter: (reciter: Reciter) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  setAudioUrl: (url: string) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setShowTranslation: (show: boolean) => void;
  
  next: () => void;
  prev: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentAyahNumber: 1,
  isPlaying: false,
  volume: 0.7,
  reciter: 'Alafasy',
  playbackMode: 'ayah-by-ayah',
  audioUrl: '',
  duration: 0,
  currentTime: 0,
  playbackSpeed: 1.0,
  showTranslation: true,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentAyah: (number) => set({ currentAyahNumber: number }),
  setVolume: (volume) => set({ volume }),
  setReciter: (reciter) => set({ reciter }),
  setPlaybackMode: (mode) => set({ playbackMode: mode }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setShowTranslation: (show) => set({ showTranslation: show }),

  next: () => {
    // Logic will be handled in the Player component / hook
  },
  prev: () => {
    // Logic will be handled in the Player component / hook
  },
}));
