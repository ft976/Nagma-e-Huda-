import { useRef, useEffect } from 'react';
import { useAudioStore } from '@/stores/useAudioStore';
import { useAppStore } from '@/stores/useAppStore';
import { getAyahAudioUrl, getSurahAudioUrl } from '@/lib/api';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    isPlaying,
    setPlaying,
    currentAyahNumber,
    setCurrentAyah,
    volume,
    reciter,
    playbackMode,
    setDuration,
    setCurrentTime,
    playbackSpeed,
  } = useAudioStore();
  
  const { activeSurah, activeAyahs } = useAppStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (playbackMode === 'ayah-by-ayah') {
        if (currentAyahNumber < (activeSurah?.numberOfAyahs || 0)) {
          setCurrentAyah(currentAyahNumber + 1);
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playbackMode, currentAyahNumber, activeSurah, setPlaying, setCurrentAyah, setCurrentTime, setDuration]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!audioRef.current || !activeSurah) return;

    let url = '';
    if (playbackMode === 'ayah-by-ayah') {
      url = getAyahAudioUrl(reciter, activeSurah.number, currentAyahNumber);
    } else {
      url = getSurahAudioUrl(activeSurah.number);
    }

    if (audioRef.current.src !== url) {
      audioRef.current.src = url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [playbackMode, currentAyahNumber, reciter, activeSurah]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return audioRef;
};
