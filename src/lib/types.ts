export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  translation?: string;
}

export interface MergedAyah extends Ayah {
  translation: string;
}

export type Reciter = 'Alafasy' | 'Sudais';
export type PlaybackMode = 'ayah-by-ayah' | 'full-surah';
