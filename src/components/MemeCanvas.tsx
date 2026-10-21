import React, { useEffect, useRef, useState } from 'react';
import { MemeFilterConfig, MemeLayout, StickerLayer, TextLayer } from '../types';
import { renderMemeToCanvas } from '../utils/canvasRenderer';
import { Sparkles, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MemeCanvasProps {
  imageSrc: string;
  layout: MemeLayout;
  textLayers: TextLayer[];
  stickers: StickerLayer[];
  filters: MemeFilterConfig;
  bannerText: string;
  isAnalyzing: boolean;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateSticker: (id: string, updates: Partial<StickerLayer>) => void;
  onSelectLayer?: (id: string | null) => void;
  selectedLayerId?: string | null;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageSrc,
  layout,
  textLayers,
  stickers,
  filters,
  bannerText,
  isAnalyzing,
  onUpdateTextLayer,
  onUpdateSticker,
  onSelectLayer,
  selectedLayerId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ id: string; type: 'text' | 'sticker' } | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  // Load image whenever source changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render canvas whenever elements, text, filters, or layout change
  useEffect(() => {
    if (!canvasRef.current || !imageElement) return;
    renderMemeToCanvas(canvasRef.current, {
      image: imageElement,
      layout,
      textLayers,
      stickers,
      filters,
      bannerText,
    });
  }, [imageElement, layout, textLayers, stickers, filters, bannerText]);

  // Mouse/Touch Dragging for Text and Stickers directly on canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // Check stickers first (top-most)
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const dist = Math.hypot(clickXPercent - s.x, clickYPercent - s.y);
      if (dist < 10) {
        setIsDragging(true);
        setDraggedItem({ id: s.id, type: 'sticker' });
        onSelectLayer?.(s.id);
        canvasRef.current.setPointerCapture(e.pointerId);
        return;
      }
    }

    // Check text layers
    for (let i = textLayers.length - 1; i >= 0; i--) {
      const t = textLayers[i];
      const distY = Math.abs(clickYPercent - t.y);
      if (distY < 12) {
        setIsDragging(true);
        setDraggedItem({ id: t.id, type: 'text' });
        onSelectLayer?.(t.id);
        canvasRef.current.setPointerCapture(e.pointerId);
        return;
      }
    }

    onSelectLayer?.(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedItem || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentXPercent = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const currentYPercent = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    if (draggedItem.type === 'text') {
      onUpdateTextLayer(draggedItem.id, { x: currentXPercent, y: currentYPercent });
    } else if (draggedItem.type === 'sticker') {
      onUpdateSticker(draggedItem.id, { x: currentXPercent, y: currentYPercent });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging && canvasRef.current) {
      try {
        canvasRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
    }
    setIsDragging(false);
    setDraggedItem(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full min-h-[380px] lg:min-h-[520px] bg-zinc-950/80 rounded-2xl border border-zinc-800/80 p-4 lg:p-8 overflow-hidden shadow-2xl backdrop-blur-sm"
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.1))}
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-zinc-300 px-1 select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((prev) => Math.min(1.6, prev + 0.1))}
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drag Hint Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-700/40 rounded-full px-3 py-1 shadow text-[11px] font-medium text-zinc-400 backdrop-blur-md">
        <Move className="w-3 h-3 text-amber-400" />
        <span>Drag text or stickers anywhere</span>
      </div>

      {/* Canvas Container with Smooth Zoom Scaling */}
      <div
        className="relative max-w-full flex items-center justify-center transition-transform duration-150 ease-out select-none"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`max-w-full max-h-[70vh] rounded-xl shadow-2xl object-contain border border-zinc-800 cursor-grab active:cursor-grabbing transition-shadow ${
            isDragging ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20' : ''
          }`}
        />

        {/* AI Analyzing Holographic Scanline Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none bg-indigo-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center border-2 border-indigo-400/80">
            {/* Animated Laser Scanning Beam */}
            <div
              className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-bounce"
              style={{ animationDuration: '2s' }}
            />

            {/* AI HUD Badge */}
            <div className="relative z-10 flex flex-col items-center gap-2 bg-zinc-900/90 border border-indigo-500/50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">
                Gemini 4 Argon Analyzing Image Context...
              </p>
              <p className="text-xs text-indigo-300/80">
                Reading facial expressions, visual irony & comedic beats
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
