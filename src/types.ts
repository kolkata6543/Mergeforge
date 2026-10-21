export type MemeLayout = 'classic' | 'banner' | 'bottom' | 'custom';

export type MemeFont = 'Impact' | 'Anton' | 'Bebas Neue' | 'Inter' | 'Montserrat' | 'Oswald' | 'Space Grotesk' | 'Comic Sans MS';

export interface TextLayer {
  id: string;
  text: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize: number; // base size
  color: string;
  strokeColor: string;
  strokeWidth: number;
  align: 'center' | 'left' | 'right';
  isUppercase: boolean;
  fontFamily: MemeFont;
  hasBackgroundBox?: boolean;
  backgroundColor?: string;
}

export interface StickerLayer {
  id: string;
  emojiOrSvg: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size: number;
  rotation: number;
}

export interface MemeFilterConfig {
  brightness: number; // default 100
  contrast: number; // default 100
  saturation: number; // default 100
  deepFried: boolean;
  grayscale: boolean;
  sepia: boolean;
  vintage: boolean;
}

export interface AICaptionSuggestion {
  id: string;
  text: string;
  topText?: string;
  bottomText?: string;
  style: 'relatable' | 'sarcastic' | 'absurdist' | 'work_tech' | 'classic' | string;
  toneTag: string;
  punchlineDescription: string;
}

export interface MemeTemplate {
  id: string;
  title: string;
  category: 'trending' | 'classic' | 'reaction' | 'tech';
  description: string;
  dataUrl: string;
  defaultTopText?: string;
  defaultBottomText?: string;
  defaultLayout?: MemeLayout;
}

export interface SavedMeme {
  id: string;
  createdAt: number;
  title: string;
  dataUrl: string;
  captionUsed?: string;
}
