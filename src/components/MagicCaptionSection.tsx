import React, { useState } from 'react';
import { AICaptionSuggestion, MemeLayout } from '../types';
import { Sparkles, Wand2, RefreshCw, Copy, Check, ChevronRight, MessageSquare, Zap, Lightbulb } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MagicCaptionSectionProps {
  imageSrc: string;
  isAnalyzing: boolean;
  captions: AICaptionSuggestion[];
  imageAnalysis: string | null;
  onGenerateCaptions: (hint?: string, tone?: string) => Promise<void>;
  onApplyCaption: (caption: AICaptionSuggestion, targetLayout?: MemeLayout) => void;
}

const HUMOR_TONES = [
  { id: 'all-round', label: '⚡ Viral Meme Lord', prompt: 'Peak internet meme humor, sharp, punchy, universal' },
  { id: 'work-tech', label: '💼 Work & Tech', prompt: 'Corporate burnout, software bugs, meetings, Slack notifications, tech struggles' },
  { id: 'sarcastic', label: '💀 Sarcastic & Brutal', prompt: 'Deeply sarcastic, dry wit, cynical reality checks' },
  { id: 'relatable', label: '☕ Relatable Adulting', prompt: 'Daily life struggles, procrastination, bills, sleep deprivation, social battery' },
  { id: 'absurdist', label: '🧠 Gen-Z & Absurdist', prompt: 'Unhinged 3am thoughts, chaotic energy, hyper-specific internet humor' },
  { id: 'wholesome', label: '✨ Wholesome & Heartwarming', prompt: 'Uplifting, sweet, cozy humor, cute wins' },
];

export const MagicCaptionSection: React.FC<MagicCaptionSectionProps> = ({
  imageSrc,
  isAnalyzing,
  captions,
  imageAnalysis,
  onGenerateCaptions,
  onApplyCaption,
}) => {
  const [selectedTone, setSelectedTone] = useState(HUMOR_TONES[0].id);
  const [customHint, setCustomHint] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAppliedId, setActiveAppliedId] = useState<string | null>(null);

  const handleTriggerMagic = async () => {
    sounds.playPop();
    const toneObj = HUMOR_TONES.find((t) => t.id === selectedTone);
    await onGenerateCaptions(customHint, toneObj?.prompt);
  };

  const handleApply = (caption: AICaptionSuggestion, layout?: MemeLayout) => {
    sounds.playPop();
    setActiveAppliedId(caption.id);
    onApplyCaption(caption, layout);
    setTimeout(() => setActiveAppliedId(null), 1500);
  };

  const handleCopyText = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Magic Caption Trigger Bar */}
      <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 shadow-xl group">
        <div className="relative bg-zinc-900 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400">
                  <Wand2 className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Magic Caption AI
                  <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30">
                    GEMINI 4 ARGON
                  </span>
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                AI analyzes facial expressions, comedic irony & visual cues to craft 5 hilarious captions.
              </p>
            </div>

            {/* Main Trigger Button */}
            <button
              onClick={handleTriggerMagic}
              disabled={isAnalyzing || !imageSrc}
              className={`relative px-5 py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                isAnalyzing
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 active:scale-95 shadow-violet-500/25 cursor-pointer'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing Image...' : captions.length > 0 ? 'Re-roll 5 Captions' : 'Magic Caption'}
            </button>
          </div>

          {/* Tone Selector & Custom Topic */}
          <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Select Humor Vibe:
              </span>
            </div>

            {/* Quick Tone Pills */}
            <div className="flex flex-wrap gap-1.5">
              {HUMOR_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    selectedTone === tone.id
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/50'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>

            {/* Custom Topic Input */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                placeholder="Optional topic: e.g. 'Monday standup', 'Final exams', 'Crypto crash'..."
                value={customHint}
                onChange={(e) => setCustomHint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTriggerMagic();
                }}
                className="flex-1 bg-zinc-950/70 border border-zinc-800 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition"
              />
              {customHint && (
                <button
                  onClick={() => setCustomHint('')}
                  className="text-xs text-zinc-500 hover:text-zinc-300 px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Context Breakdown Insight Box */}
      {imageAnalysis && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 flex items-start gap-2.5 text-xs text-zinc-300">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 mr-1.5">Image Context:</span>
            <span>{imageAnalysis}</span>
          </div>
        </div>
      )}

      {/* Suggested 5 Captions Cards */}
      {captions.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              5 AI-Suggested Captions (Click any to overlay)
            </span>
            <button
              onClick={handleTriggerMagic}
              disabled={isAnalyzing}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer transition font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
              More ideas
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {captions.map((cap, idx) => {
              const isApplied = activeAppliedId === cap.id;
              return (
                <div
                  key={cap.id || idx}
                  onClick={() => handleApply(cap)}
                  className={`group relative p-3.5 rounded-xl border transition-all duration-200 text-left cursor-pointer flex flex-col gap-2 ${
                    isApplied
                      ? 'bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500'
                      : 'bg-zinc-900/90 hover:bg-zinc-850/90 border-zinc-800/80 hover:border-zinc-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                        {cap.toneTag || cap.style}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Copy Text Button */}
                      <button
                        onClick={(e) => handleCopyText(cap.text, cap.id, e)}
                        className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition"
                        title="Copy text"
                      >
                        {copiedId === cap.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Quick Apply Indicator */}
                      <span className="text-[11px] font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-0.5 ml-1">
                        Apply
                        <ChevronRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Caption Content */}
                  <div className="text-sm font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-white">
                    {cap.text}
                  </div>

                  {/* Punchline Observation */}
                  {cap.punchlineDescription && (
                    <div className="text-[11px] text-zinc-400 italic">
                      "{cap.punchlineDescription}"
                    </div>
                  )}

                  {/* Quick Layout Presets for this specific caption */}
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="text-[10px]">Format:</span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleApply(cap, 'classic')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                        title="Top & Bottom Impact"
                      >
                        Classic Top/Bottom
                      </button>
                      <button
                        onClick={() => handleApply(cap, 'banner')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                        title="Social Media Header Banner"
                      >
                        Top Banner
                      </button>
                      <button
                        onClick={() => handleApply(cap, 'bottom')}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition cursor-pointer"
                        title="Subtitle on bottom"
                      >
                        Subtitle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State / Initial Prompt */}
      {captions.length === 0 && !isAnalyzing && (
        <div className="bg-zinc-900/40 border border-zinc-800/60 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-zinc-300">
            Click "Magic Caption" above to start
          </p>
          <p className="text-[11px] text-zinc-500 max-w-sm">
            Gemini 4 Argon will inspect your image and suggest 5 tailored captions ready to overlay instantly.
          </p>
        </div>
      )}
    </div>
  );
};
