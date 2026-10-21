import React, { useState } from 'react';
import { MEME_TEMPLATES } from '../utils/memeTemplates';
import { MemeTemplate } from '../types';
import { Upload, Image as ImageIcon, Search, Sparkles, FolderUp } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TemplateGalleryProps {
  currentTemplateId?: string;
  onSelectTemplate: (template: MemeTemplate) => void;
  onUploadCustomImage: (dataUrl: string, name?: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentTemplateId,
  onSelectTemplate,
  onUploadCustomImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'trending', label: '🔥 Trending' },
    { id: 'classic', label: '⭐ Classic' },
    { id: 'reaction', label: '👀 Reaction' },
    { id: 'tech', label: '💻 Tech / Dev' },
  ];

  const filteredTemplates = MEME_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesQuery =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        sounds.playPop();
        onUploadCustomImage(result, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
        className={`relative group rounded-2xl border-2 border-dashed p-4 transition-all duration-200 text-center flex flex-col items-center justify-center gap-2 ${
          isDraggingFile
            ? 'border-violet-500 bg-violet-950/30'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          id="custom-meme-file"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">
            <span className="text-violet-400">Click to upload</span> or drag and drop any photo
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            PNG, JPG, WebP, GIF or paste from clipboard (Ctrl+V)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meme templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-200 text-zinc-900 font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredTemplates.map((template) => {
          const isSelected = currentTemplateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => {
                sounds.playPop();
                onSelectTemplate(template);
              }}
              className={`group relative flex flex-col rounded-xl overflow-hidden border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-violet-500 ring-2 ring-violet-500/50 shadow-md shadow-violet-500/20'
                  : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/90'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden relative">
                <img
                  src={template.dataUrl}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-violet-600 text-[10px] font-bold text-white shadow">
                    Active
                  </div>
                )}
              </div>

              {/* Template Label */}
              <div className="p-2 flex flex-col gap-0.5 bg-zinc-900/90">
                <span className="text-xs font-bold text-zinc-200 truncate group-hover:text-white">
                  {template.title}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">
                  {template.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
