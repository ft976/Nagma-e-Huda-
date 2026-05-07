import { Surah, Ayah, MergedAyah } from './types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahsList = async (): Promise<Surah[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahAyahs = async (surahNumber: number): Promise<MergedAyah[]> => {
  const [arabicResponse, englishResponse] = await Promise.all([
    fetch(`${BASE_URL}/surah/${surahNumber}/quran-uthmani`),
    fetch(`${BASE_URL}/surah/${surahNumber}/en.asad`),
  ]);

  const arabicData = await arabicResponse.json();
  const englishData = await englishResponse.json();

  const arabicAyahs: Ayah[] = arabicData.data.ayahs;
  const englishAyahs: any[] = englishData.data.ayahs;

  return arabicAyahs.map((ayah, index) => ({
    ...ayah,
    translation: englishAyahs[index].text,
  }));
};

export const padNumber = (num: number, length: number = 3): string => {
  return num.toString().padStart(length, '0');
};

export const getAyahAudioUrl = (reciter: string, surah: number, ayah: number): string => {
  const s = padNumber(surah);
  const a = padNumber(ayah);
  return `https://verses.quran.com/${reciter}/mp3/${s}${a}.mp3`;
};

export const getSurahAudioUrl = (surah: number): string => {
  const s = padNumber(surah);
  return `https://server8.mp3quran.net/afs/${s}.mp3`;
};
