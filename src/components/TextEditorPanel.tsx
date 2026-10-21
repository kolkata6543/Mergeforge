import React from 'react';
import { MemeFont, MemeLayout, TextLayer } from '../types';
import { Type, AlignCenter, AlignLeft, AlignRight, Plus, Trash2, Sliders, BoxSelect } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TextEditorPanelProps {
  layout: MemeLayout;
  onChangeLayout: (layout: MemeLayout) => void;
  bannerText: string;
  onChangeBannerText: (text: string) => void;
  textLayers: TextLayer[];
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onAddTextLayer: () => void;
  onDeleteTextLayer: (id: string) => void;
  selectedLayerId?: string | null;
  onSelectLayer?: (id: string | null) => void;
}

const FONTS: { id: MemeFont; label: string }[] = [
  { id: 'Impact', label: 'Impact (Classic Meme)' },
  { id: 'Anton', label: 'Anton (Heavy Headline)' },
  { id: 'Bebas Neue', label: 'Bebas Neue (Tall Bold)' },
  { id: 'Inter', label: 'Inter (Modern Clean)' },
  { id: 'Space Grotesk', label: 'Space Grotesk (Tech)' },
  { id: 'Oswald', label: 'Oswald (Compact)' },
  { id: 'Montserrat', label: 'Montserrat (Modern Bold)' },
  { id: 'Comic Sans MS', label: 'Comic Sans (Ironic)' },
];

const PRESET_COLORS = ['#ffffff', '#000000', '#facc15', '#ef4444', '#22c55e', '#38bdf8', '#a855f7'];

export const TextEditorPanel: React.FC<TextEditorPanelProps> = ({
  layout,
  onChangeLayout,
  bannerText,
  onChangeBannerText,
  textLayers,
  onUpdateTextLayer,
  onAddTextLayer,
  onDeleteTextLayer,
  selectedLayerId,
  onSelectLayer,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Layout Mode Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Meme Style & Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              onChangeLayout('classic');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              layout === 'classic'
                ? 'bg-violet-950/40 border-violet-500 text-white shadow-sm ring-1 ring-violet-500'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Top & Bottom</span>
            <span className="text-[10px] font-normal text-zinc-500">Classic Impact</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onChangeLayout('banner');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              layout === 'banner'
                ? 'bg-violet-950/40 border-violet-500 text-white shadow-sm ring-1 ring-violet-500'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Top Banner</span>
            <span className="text-[10px] font-normal text-zinc-500">Twitter/Reddit Box</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onChangeLayout('bottom');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
              layout === 'bottom'
                ? 'bg-violet-950/40 border-violet-500 text-white shadow-sm ring-1 ring-violet-500'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Subtitle Pill</span>
            <span className="text-[10px] font-normal text-zinc-500">Cinematic Bottom</span>
          </button>
        </div>
      </div>

      {/* Banner Input if in banner layout */}
      {layout === 'banner' && (
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <BoxSelect className="w-3.5 h-3.5 text-violet-400" />
            Top Banner Caption
          </label>
          <textarea
            rows={2}
            value={bannerText}
            onChange={(e) => onChangeBannerText(e.target.value)}
            placeholder="Type modern header caption..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-2.5 text-xs text-zinc-200 outline-none resize-none"
          />
        </div>
      )}

      {/* Text Layers List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Text Layers ({textLayers.length})
          </label>
          <button
            onClick={() => {
              sounds.playPop();
              onAddTextLayer();
            }}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Text
          </button>
        </div>

        {textLayers.map((layer, index) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer?.(layer.id)}
              className={`p-3 rounded-xl border transition-all flex flex-col gap-3 ${
                isSelected
                  ? 'bg-zinc-900 border-violet-500/80 ring-1 ring-violet-500/40'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-750'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-300">
                  {index === 0 && layout === 'classic'
                    ? 'Top Caption'
                    : index === 1 && layout === 'classic'
                    ? 'Bottom Caption'
                    : `Layer ${index + 1}`}
                </span>

                <div className="flex items-center gap-1">
                  {/* Delete button if more than 1 layer */}
                  {textLayers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTextLayer(layer.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Text input */}
              <input
                type="text"
                value={layer.text}
                onChange={(e) => onUpdateTextLayer(layer.id, { text: e.target.value })}
                placeholder="Enter caption text..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
              />

              {/* Typography Options Bar */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Font Selector */}
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">Font Family</label>
                  <select
                    value={layer.fontFamily}
                    onChange={(e) => onUpdateTextLayer(layer.id, { fontFamily: e.target.value as MemeFont })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 outline-none"
                  >
                    {FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alignment & Uppercase */}
                <div>
                  <label className="text-[10px] text-zinc-400 font-medium block mb-1">Style & Align</label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateTextLayer(layer.id, { align: 'left' })}
                      className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                        layer.align === 'left' ? 'bg-zinc-800 border-zinc-600 text-white' : 'border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateTextLayer(layer.id, { align: 'center' })}
                      className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                        layer.align === 'center' ? 'bg-zinc-800 border-zinc-600 text-white' : 'border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateTextLayer(layer.id, { align: 'right' })}
                      className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                        layer.align === 'right' ? 'bg-zinc-800 border-zinc-600 text-white' : 'border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateTextLayer(layer.id, { isUppercase: !layer.isUppercase })}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold font-mono transition cursor-pointer ${
                        layer.isUppercase ? 'bg-violet-900/60 border-violet-500 text-white' : 'border-zinc-800 text-zinc-500'
                      }`}
                      title="Toggle ALL CAPS"
                    >
                      AA
                    </button>
                  </div>
                </div>
              </div>

              {/* Sliders: Size and Stroke Width */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Font Size</span>
                    <span className="font-mono">{layer.fontSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={layer.fontSize}
                    onChange={(e) => onUpdateTextLayer(layer.id, { fontSize: Number(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                    <span>Outline Stroke</span>
                    <span className="font-mono">{layer.strokeWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.strokeWidth}
                    onChange={(e) => onUpdateTextLayer(layer.id, { strokeWidth: Number(e.target.value) })}
                    className="w-full accent-violet-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400">Color:</span>
                  <div className="flex items-center gap-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateTextLayer(layer.id, { color: c })}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                          layer.color.toLowerCase() === c.toLowerCase()
                            ? 'ring-2 ring-violet-500 scale-110 border-white'
                            : 'border-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtitle Pill / Box Background Toggle */}
                <button
                  onClick={() => onUpdateTextLayer(layer.id, { hasBackgroundBox: !layer.hasBackgroundBox })}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded transition cursor-pointer ${
                    layer.hasBackgroundBox
                      ? 'bg-zinc-800 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  {layer.hasBackgroundBox ? 'Box Pill: ON' : '+ Add Box Pill'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
