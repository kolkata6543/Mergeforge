import React from 'react';
import { MemeFilterConfig, StickerLayer } from '../types';
import { Flame, Sliders, Smile, Trash2, RotateCw, ZoomIn, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface StickersAndFiltersPanelProps {
  stickers: StickerLayer[];
  onAddSticker: (emoji: string) => void;
  onUpdateSticker: (id: string, updates: Partial<StickerLayer>) => void;
  onDeleteSticker: (id: string) => void;
  filters: MemeFilterConfig;
  onUpdateFilters: (updates: Partial<MemeFilterConfig>) => void;
  onResetFilters: () => void;
}

const MEME_EMOJIS = [
  '💀', '🤡', '🔥', '😭', '😎', '🧢', '💯', '🚀',
  '🤝', '👀', '🚨', '👑', '☕', '💻', '📈', '📉',
  '🕶️', '🔴', '⭐', '💣', '💩', '🤯', '🍿', '⚡'
];

export const StickersAndFiltersPanel: React.FC<StickersAndFiltersPanelProps> = ({
  stickers,
  onAddSticker,
  onUpdateSticker,
  onDeleteSticker,
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Stickers Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            Meme Stickers & Emojis
          </label>
          <span className="text-[11px] text-zinc-500">Tap to place on canvas</span>
        </div>

        {/* Emoji Grid */}
        <div className="grid grid-cols-8 gap-1.5 p-2 bg-zinc-900/80 border border-zinc-800 rounded-xl">
          {MEME_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                sounds.playPop();
                onAddSticker(emoji);
              }}
              className="text-lg p-1.5 hover:bg-zinc-800 rounded-lg transition active:scale-90 flex items-center justify-center cursor-pointer"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Active Stickers List */}
        {stickers.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Placed Stickers ({stickers.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {stickers.map((stk, idx) => (
                <div
                  key={stk.id}
                  className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{stk.emojiOrSvg}</span>
                    <span className="text-zinc-400 text-[11px]">Sticker {idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rotate button */}
                    <button
                      onClick={() => onUpdateSticker(stk.id, { rotation: (stk.rotation + 45) % 360 })}
                      className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
                      title="Rotate 45°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    {/* Size Slider */}
                    <input
                      type="range"
                      min="40"
                      max="200"
                      value={stk.size}
                      onChange={(e) => onUpdateSticker(stk.id, { size: Number(e.target.value) })}
                      className="w-16 accent-amber-500 h-1 bg-zinc-800 cursor-pointer"
                      title="Scale"
                    />
                    {/* Delete */}
                    <button
                      onClick={() => onDeleteSticker(stk.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meme Filters Section */}
      <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            Meme Filters & Effects
          </label>
          <button
            onClick={onResetFilters}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Quick Filter Presets */}
        <div className="grid grid-cols-2 gap-2">
          {/* Deep Fried */}
          <button
            onClick={() => {
              sounds.playPop();
              onUpdateFilters({ deepFried: !filters.deepFried });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              filters.deepFried
                ? 'bg-orange-950/40 border-orange-500 text-orange-300 ring-1 ring-orange-500/50'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Deep Fried 🔥
            </span>
            <span className="text-[10px] font-mono">{filters.deepFried ? 'ON' : 'OFF'}</span>
          </button>

          {/* Vintage VHS */}
          <button
            onClick={() => {
              sounds.playPop();
              onUpdateFilters({ vintage: !filters.vintage });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              filters.vintage
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Vintage Vignette</span>
            <span className="text-[10px] font-mono">{filters.vintage ? 'ON' : 'OFF'}</span>
          </button>

          {/* Grayscale */}
          <button
            onClick={() => {
              sounds.playPop();
              onUpdateFilters({ grayscale: !filters.grayscale });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              filters.grayscale
                ? 'bg-zinc-800 border-zinc-500 text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Black & White</span>
            <span className="text-[10px] font-mono">{filters.grayscale ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sepia */}
          <button
            onClick={() => {
              sounds.playPop();
              onUpdateFilters({ sepia: !filters.sepia });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              filters.sepia
                ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Sepia Nostalgia</span>
            <span className="text-[10px] font-mono">{filters.sepia ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Contrast */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span>Contrast</span>
              <span className="font-mono">{filters.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={filters.contrast}
              onChange={(e) => onUpdateFilters({ contrast: Number(e.target.value) })}
              className="w-full accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Brightness */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span>Brightness</span>
              <span className="font-mono">{filters.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              value={filters.brightness}
              onChange={(e) => onUpdateFilters({ brightness: Number(e.target.value) })}
              className="w-full accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span>Saturation</span>
              <span className="font-mono">{filters.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={filters.saturation}
              onChange={(e) => onUpdateFilters({ saturation: Number(e.target.value) })}
              className="w-full accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
