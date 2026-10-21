import React from 'react';
import { SavedMeme } from '../types';
import { Download, Trash2, ArrowUpRight, FolderHeart, Calendar } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MemeVaultProps {
  savedMemes: SavedMeme[];
  onLoadMeme: (meme: SavedMeme) => void;
  onDeleteMeme: (id: string) => void;
  onClearAll: () => void;
}

export const MemeVault: React.FC<MemeVaultProps> = ({
  savedMemes,
  onLoadMeme,
  onDeleteMeme,
  onClearAll,
}) => {
  const handleDownloadSingle = (meme: SavedMeme, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playSuccess();
    const link = document.createElement('a');
    link.download = `memeforge-${meme.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = meme.dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-violet-400" />
            My Saved Memes Vault ({savedMemes.length})
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Your created memes saved locally in this browser.
          </p>
        </div>

        {savedMemes.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all saved memes from vault?')) {
                onClearAll();
              }
            }}
            className="text-[11px] text-zinc-500 hover:text-red-400 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {savedMemes.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/60 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center">
            <FolderHeart className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-zinc-300">Vault is empty</p>
          <p className="text-[11px] text-zinc-500 max-w-xs">
            Export or click "Save to Vault" to preserve your funniest meme creations here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {savedMemes.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                sounds.playPop();
                onLoadMeme(m);
              }}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-zinc-800/80 hover:border-violet-500/80 bg-zinc-900/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden relative">
                <img
                  src={m.dataUrl}
                  alt={m.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                  <span className="text-[10px] text-violet-300 font-semibold flex items-center gap-0.5">
                    Load into editor <ArrowUpRight className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadSingle(m, e)}
                      className="p-1 rounded bg-zinc-800/90 hover:bg-zinc-700 text-white transition"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMeme(m.id);
                      }}
                      className="p-1 rounded bg-zinc-800/90 hover:bg-red-900 text-zinc-400 hover:text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2 flex flex-col gap-0.5 bg-zinc-900">
                <span className="text-xs font-bold text-zinc-200 truncate group-hover:text-white">
                  {m.title || 'Untitled Meme'}
                </span>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
