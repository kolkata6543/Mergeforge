import React, { useState, useEffect, useRef } from 'react';
import { MemeCanvas } from './components/MemeCanvas';
import { MagicCaptionSection } from './components/MagicCaptionSection';
import { TemplateGallery } from './components/TemplateGallery';
import { TextEditorPanel } from './components/TextEditorPanel';
import { AIImageStudio } from './components/AIImageStudio';
import { StickersAndFiltersPanel } from './components/StickersAndFiltersPanel';
import { MemeVault } from './components/MemeVault';
import { MEME_TEMPLATES } from './utils/memeTemplates';
import { AICaptionSuggestion, MemeFilterConfig, MemeLayout, SavedMeme, StickerLayer, TextLayer } from './types';
import { sounds } from './utils/soundEffects';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Type,
  Smile,
  FolderHeart,
  Download,
  Copy,
  Share2,
  Volume2,
  VolumeX,
  BookmarkPlus,
  RefreshCw,
  Flame,
  Check,
  RotateCcw,
} from 'lucide-react';

const DEFAULT_FILTERS: MemeFilterConfig = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  deepFried: false,
  grayscale: false,
  sepia: false,
  vintage: false,
};

export default function App() {
  // Current meme template or image
  const [currentTemplate, setCurrentTemplate] = useState(MEME_TEMPLATES[0]);
  const [imageSrc, setImageSrc] = useState<string>(MEME_TEMPLATES[0].dataUrl);
  const [layout, setLayout] = useState<MemeLayout>('classic');
  const [bannerText, setBannerText] = useState<string>('WHEN THE CODE COMPILES ON FIRST TRY');

  // Text Layers
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 'top-1',
      text: MEME_TEMPLATES[0].defaultTopText || 'TOP TEXT',
      x: 50,
      y: 12,
      fontSize: 90,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 40,
      align: 'center',
      isUppercase: true,
      fontFamily: 'Impact',
    },
    {
      id: 'bottom-1',
      text: MEME_TEMPLATES[0].defaultBottomText || 'BOTTOM TEXT',
      x: 50,
      y: 88,
      fontSize: 90,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 40,
      align: 'center',
      isUppercase: true,
      fontFamily: 'Impact',
    },
  ]);

  // Stickers and Filters
  const [stickers, setStickers] = useState<StickerLayer[]>([]);
  const [filters, setFilters] = useState<MemeFilterConfig>(DEFAULT_FILTERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Magic Caption state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [captions, setCaptions] = useState<AICaptionSuggestion[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState<'magic' | 'templates' | 'text' | 'ai_studio' | 'stickers' | 'vault'>('magic');

  // Vault (saved memes in localStorage)
  const [savedMemes, setSavedMemes] = useState<SavedMeme[]>([]);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load saved memes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memeforge_vault');
      if (stored) {
        setSavedMemes(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Sync sound manager
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle template selection
  const handleSelectTemplate = (template: typeof MEME_TEMPLATES[0]) => {
    setCurrentTemplate(template);
    setImageSrc(template.dataUrl);
    setLayout(template.defaultLayout || 'classic');

    setTextLayers([
      {
        id: `top-${Date.now()}`,
        text: template.defaultTopText || 'TOP TEXT',
        x: 50,
        y: 12,
        fontSize: 90,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 40,
        align: 'center',
        isUppercase: true,
        fontFamily: 'Impact',
      },
      {
        id: `bottom-${Date.now() + 1}`,
        text: template.defaultBottomText || 'BOTTOM TEXT',
        x: 50,
        y: 88,
        fontSize: 90,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 40,
        align: 'center',
        isUppercase: true,
        fontFamily: 'Impact',
      },
    ]);
    if (template.defaultTopText) {
      setBannerText(template.defaultTopText);
    }
    setCaptions([]);
    setImageAnalysis(null);
  };

  // Handle custom uploaded image
  const handleUploadCustomImage = (dataUrl: string, name?: string) => {
    setImageSrc(dataUrl);
    setTextLayers([
      {
        id: `top-${Date.now()}`,
        text: 'ME WHEN',
        x: 50,
        y: 12,
        fontSize: 90,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 40,
        align: 'center',
        isUppercase: true,
        fontFamily: 'Impact',
      },
      {
        id: `bottom-${Date.now() + 1}`,
        text: 'CLICK MAGIC CAPTION',
        x: 50,
        y: 88,
        fontSize: 90,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 40,
        align: 'center',
        isUppercase: true,
        fontFamily: 'Impact',
      },
    ]);
    setCaptions([]);
    setImageAnalysis(null);
    // Switch to magic caption tab automatically so user gets prompt
    setActiveTab('magic');
  };

  // Core feature: Call Magic Caption API powered by Gemini 4 Argon
  const handleGenerateCaptions = async (hint?: string, tone?: string) => {
    if (!imageSrc || isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageSrc,
          userHint: hint,
          tone: tone,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await res.json();
      if (data.captions && data.captions.length > 0) {
        sounds.playMagic();
        setCaptions(data.captions);
        setImageAnalysis(data.imageAnalysis || null);
      }
    } catch (err: any) {
      console.error('Magic caption error:', err);
      alert(err.message || 'Error running Magic Caption with Gemini');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Instant overlay of AI caption onto canvas
  const handleApplyCaption = (caption: AICaptionSuggestion, targetLayout?: MemeLayout) => {
    const chosenLayout = targetLayout || layout;

    if (chosenLayout === 'banner') {
      setLayout('banner');
      setBannerText(caption.text);
      // Clean up text layers so image is clear
      setTextLayers([]);
    } else if (chosenLayout === 'bottom') {
      setLayout('bottom');
      setTextLayers([
        {
          id: `bottom-${Date.now()}`,
          text: caption.text,
          x: 50,
          y: 88,
          fontSize: 75,
          color: '#facc15',
          strokeColor: '#000000',
          strokeWidth: 35,
          align: 'center',
          isUppercase: false,
          fontFamily: 'Inter',
          hasBackgroundBox: true,
          backgroundColor: 'rgba(0,0,0,0.75)',
        },
      ]);
    } else {
      // Classic Top & Bottom
      setLayout('classic');
      const topStr = caption.topText || (caption.text.includes('\n') ? caption.text.split('\n')[0] : caption.text);
      const bottomStr = caption.bottomText || (caption.text.includes('\n') ? caption.text.split('\n')[1] : '');

      setTextLayers([
        {
          id: `top-${Date.now()}`,
          text: topStr,
          x: 50,
          y: 12,
          fontSize: 85,
          color: '#ffffff',
          strokeColor: '#000000',
          strokeWidth: 40,
          align: 'center',
          isUppercase: true,
          fontFamily: 'Impact',
        },
        {
          id: `bottom-${Date.now() + 1}`,
          text: bottomStr || (topStr ? '' : caption.text),
          x: 50,
          y: 88,
          fontSize: 85,
          color: '#ffffff',
          strokeColor: '#000000',
          strokeWidth: 40,
          align: 'center',
          isUppercase: true,
          fontFamily: 'Impact',
        },
      ]);
    }
  };

  // Layer Update Handlers
  const handleUpdateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleAddTextLayer = () => {
    setTextLayers((prev) => [
      ...prev,
      {
        id: `layer-${Date.now()}`,
        text: 'NEW CAPTION',
        x: 50,
        y: 50,
        fontSize: 70,
        color: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 35,
        align: 'center',
        isUppercase: true,
        fontFamily: 'Impact',
      },
    ]);
  };

  const handleDeleteTextLayer = (id: string) => {
    setTextLayers((prev) => prev.filter((l) => l.id !== id));
  };

  // Sticker Handlers
  const handleAddSticker = (emoji: string) => {
    setStickers((prev) => [
      ...prev,
      {
        id: `sticker-${Date.now()}`,
        emojiOrSvg: emoji,
        x: 50,
        y: 50,
        size: 90,
        rotation: 0,
      },
    ]);
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerLayer>) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Export Meme (Download)
  const handleDownload = () => {
    sounds.playSuccess();
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Auto-save to vault
    saveToVaultInternal(dataUrl);
  };

  // Copy Meme Directly to Clipboard
  const handleCopyClipboard = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        sounds.playSuccess();
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
      });
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      // Fallback: download
      handleDownload();
    }
  };

  // Web Share
  const handleShare = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas || !navigator.share) {
      handleCopyClipboard();
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'meme.png', { type: 'image/png' });
        await navigator.share({
          title: 'Meme created with MemeForge AI',
          files: [file],
        });
      });
    } catch {
      // Ignored
    }
  };

  // Save to Local Vault
  const saveToVaultInternal = (dataUrl: string) => {
    const newMeme: SavedMeme = {
      id: `vault-${Date.now()}`,
      createdAt: Date.now(),
      title: textLayers[0]?.text || bannerText || 'Untitled Meme',
      dataUrl,
    };
    const updated = [newMeme, ...savedMemes.slice(0, 24)];
    setSavedMemes(updated);
    try {
      localStorage.setItem('memeforge_vault', JSON.stringify(updated));
    } catch {
      // Storage full
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleManualSaveVault = () => {
    sounds.playSuccess();
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    saveToVaultInternal(canvas.toDataURL('image/png'));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 border-b border-zinc-800/80 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-violet-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base lg:text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  MemeForge
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-sm">
                  AI MAGIC
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                Gemini 4 Argon image understanding • Gemini Nano Banana 2.1 art
              </p>
            </div>
          </div>

          {/* Quick Action Header Bar */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition"
              title={soundEnabled ? 'Mute UI sounds' : 'Enable UI sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-violet-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Copy Meme Button */}
            <button
              onClick={handleCopyClipboard}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer"
              title="Copy meme image to clipboard for Slack/Discord"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Save to Vault */}
            <button
              onClick={handleManualSaveVault}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer"
              title="Save to local vault"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>{savedToast ? 'Saved!' : 'Save'}</span>
            </button>

            {/* Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {/* Main Export Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 font-bold text-xs tracking-wide text-white shadow-lg shadow-violet-500/25 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Meme</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Interactive Meme Canvas Preview */}
        <section className="flex-1 flex flex-col gap-4">
          <MemeCanvas
            imageSrc={imageSrc}
            layout={layout}
            textLayers={textLayers}
            stickers={stickers}
            filters={filters}
            bannerText={bannerText}
            isAnalyzing={isAnalyzing}
            onUpdateTextLayer={handleUpdateTextLayer}
            onUpdateSticker={handleUpdateSticker}
            onSelectLayer={setSelectedLayerId}
            selectedLayerId={selectedLayerId}
          />

          {/* Quick Under-Canvas Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-300">Quick Template:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-medium">
                {currentTemplate?.title || 'Custom Photo'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  handleGenerateCaptions();
                }}
                disabled={isAnalyzing}
                className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Trigger Magic Caption
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Tabbed Control Center */}
        <section className="w-full lg:w-[480px] shrink-0 flex flex-col bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-950/70 p-1.5 overflow-x-auto scrollbar-none gap-1">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('magic');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'magic'
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Magic Caption</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('templates');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('text');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Format</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('ai_studio');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'ai_studio'
                  ? 'bg-zinc-800 text-pink-400 shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Gen</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('stickers');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'stickers'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>FX</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('vault');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Vault</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="p-4 lg:p-5 flex-1 overflow-y-auto max-h-[75vh]">
            {activeTab === 'magic' && (
              <MagicCaptionSection
                imageSrc={imageSrc}
                isAnalyzing={isAnalyzing}
                captions={captions}
                imageAnalysis={imageAnalysis}
                onGenerateCaptions={handleGenerateCaptions}
                onApplyCaption={handleApplyCaption}
              />
            )}

            {activeTab === 'templates' && (
              <TemplateGallery
                currentTemplateId={currentTemplate?.id}
                onSelectTemplate={handleSelectTemplate}
                onUploadCustomImage={handleUploadCustomImage}
              />
            )}

            {activeTab === 'text' && (
              <TextEditorPanel
                layout={layout}
                onChangeLayout={setLayout}
                bannerText={bannerText}
                onChangeBannerText={setBannerText}
                textLayers={textLayers}
                onUpdateTextLayer={handleUpdateTextLayer}
                onAddTextLayer={handleAddTextLayer}
                onDeleteTextLayer={handleDeleteTextLayer}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
              />
            )}

            {activeTab === 'ai_studio' && (
              <AIImageStudio
                currentImageSrc={imageSrc}
                onImageGenerated={(newImg) => {
                  setImageSrc(newImg);
                  setCaptions([]);
                  setImageAnalysis(null);
                  setActiveTab('magic');
                }}
              />
            )}

            {activeTab === 'stickers' && (
              <StickersAndFiltersPanel
                stickers={stickers}
                onAddSticker={handleAddSticker}
                onUpdateSticker={handleUpdateSticker}
                onDeleteSticker={handleDeleteSticker}
                filters={filters}
                onUpdateFilters={(upd) => setFilters((prev) => ({ ...prev, ...upd }))}
                onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              />
            )}

            {activeTab === 'vault' && (
              <MemeVault
                savedMemes={savedMemes}
                onLoadMeme={(meme) => {
                  setImageSrc(meme.dataUrl);
                  setActiveTab('text');
                }}
                onDeleteMeme={(id) => {
                  const updated = savedMemes.filter((m) => m.id !== id);
                  setSavedMemes(updated);
                  localStorage.setItem('memeforge_vault', JSON.stringify(updated));
                }}
                onClearAll={() => {
                  setSavedMemes([]);
                  localStorage.removeItem('memeforge_vault');
                }}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
