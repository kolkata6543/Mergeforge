import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Palette, Layers, Lightbulb, ImagePlus } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AIImageStudioProps {
  currentImageSrc: string;
  onImageGenerated: (imageUrl: string, promptUsed: string) => void;
}

const PROMPT_STARTERS = [
  'A very serious orange cat in a business suit giving an urgent quarterly presentation',
  'An exhausted astronaut realizing there is no coffee on Mars',
  'A golden retriever programmer staring at 400 compiler errors',
  'A stressed medieval knight trying to fix a printer',
  'Two raccoons wearing sunglasses arguing over a slice of pizza in an alley',
  'A tiny hamster bench-pressing a giant strawberry at the gym',
];

const EDIT_STARTERS = [
  'Add glowing red laser eyes and dramatic lighting',
  'Add a tiny graduation cap and celebratory confetti',
  'Add pixelated "Thug Life" black sunglasses and golden chain',
  'Turn background into dramatic fiery explosion',
  'Make the scene look like a 90s vintage VHS cartoon screenshot',
];

export const AIImageStudio: React.FC<AIImageStudioProps> = ({
  currentImageSrc,
  onImageGenerated,
}) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewGenerated, setPreviewGenerated] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    sounds.playPop();

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          baseImage: mode === 'edit' ? currentImageSrc : undefined,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.imageUrl) {
        sounds.playSuccess();
        setPreviewGenerated(data.imageUrl);
        onImageGenerated(data.imageUrl, prompt);
      } else {
        throw new Error('No image was returned from the model');
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setErrorMsg(err.message || 'Error communicating with AI image model');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            AI Image Creator & Editor
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Create brand new meme images or edit existing pictures with text prompts.
          </p>
        </div>
        <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
          GEMINI NANO BANANA 2.1
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => {
            setMode('create');
            setErrorMsg(null);
          }}
          className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'create'
              ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ImagePlus className="w-3.5 h-3.5" />
          Create New Image
        </button>
        <button
          onClick={() => {
            setMode('edit');
            setErrorMsg(null);
          }}
          className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'edit'
              ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          AI Edit Current Image
        </button>
      </div>

      {/* Aspect Ratio Selector (for creation) */}
      {mode === 'create' && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium text-zinc-300">Aspect Ratio:</span>
          <div className="flex items-center gap-1">
            {(['1:1', '16:9', '4:3', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  aspectRatio === ratio
                    ? 'bg-zinc-200 text-zinc-900 font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-300">
          {mode === 'create' ? 'Describe the meme scene you want to generate:' : 'Describe edits to apply to current image:'}
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'create'
              ? "E.g. A tired programmer cat drinking coffee in a busy office..."
              : "E.g. Add glowing red laser eyes and explosions in the background..."
          }
          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-pink-500 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none resize-none transition"
        />
      </div>

      {/* Quick Prompt Ideas */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Quick Ideas:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(mode === 'create' ? PROMPT_STARTERS : EDIT_STARTERS).slice(0, 4).map((idea, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(idea)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-lg text-left truncate max-w-[280px] transition cursor-pointer"
            >
              "{idea}"
            </button>
          ))}
        </div>
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide text-white transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
          isGenerating || !prompt.trim()
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-500 hover:via-rose-500 hover:to-amber-500 shadow-pink-500/25 active:scale-98'
        }`}
      >
        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating
          ? mode === 'create'
            ? 'Creating Meme Image with Gemini...'
            : 'Applying AI Edits...'
          : mode === 'create'
          ? 'Generate Meme Image'
          : 'Apply AI Edit to Image'}
      </button>

      {/* Generated Preview status */}
      {previewGenerated && (
        <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex items-center gap-3">
          <img src={previewGenerated} alt="Generated" className="w-12 h-12 rounded-lg object-cover border border-emerald-700/60" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-300">Image Loaded onto Canvas!</p>
            <p className="text-[11px] text-emerald-400/80">Click "Magic Caption" to generate funny text for this image.</p>
          </div>
        </div>
      )}
    </div>
  );
};
