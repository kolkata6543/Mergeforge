import { MemeFilterConfig, MemeLayout, StickerLayer, TextLayer } from '../types';

export interface RenderOptions {
  image: HTMLImageElement | null;
  layout: MemeLayout;
  textLayers: TextLayer[];
  stickers: StickerLayer[];
  filters: MemeFilterConfig;
  bannerText?: string;
}

/**
 * Split text into wrapped lines that fit within maxWidth
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : [''];
}

/**
 * Apply filters to canvas context
 */
function buildFilterString(filters: MemeFilterConfig): string {
  const parts: string[] = [];

  if (filters.deepFried) {
    parts.push('contrast(220%) saturate(300%) brightness(110%)');
  } else {
    if (filters.brightness !== 100) {
      parts.push(`brightness(${filters.brightness}%)`);
    }
    if (filters.contrast !== 100) {
      parts.push(`contrast(${filters.contrast}%)`);
    }
    if (filters.saturation !== 100) {
      parts.push(`saturate(${filters.saturation}%)`);
    }
  }

  if (filters.grayscale) parts.push('grayscale(100%)');
  if (filters.sepia) parts.push('sepia(100%)');

  return parts.join(' ') || 'none';
}

/**
 * Main render function onto a target canvas
 */
export function renderMemeToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !options.image) return;

  const img = options.image;
  const imgWidth = img.naturalWidth || img.width || 800;
  const imgHeight = img.naturalHeight || img.height || 600;

  // Banner layout adds white header space on top
  let bannerHeight = 0;
  if (options.layout === 'banner' && options.bannerText) {
    // Estimate banner height based on image width
    bannerHeight = Math.max(120, Math.round(imgWidth * 0.18));
  }

  canvas.width = imgWidth;
  canvas.height = imgHeight + bannerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Banner background if layout is banner
  if (bannerHeight > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, bannerHeight);

    // Draw banner text in clean modern sans-serif
    ctx.save();
    ctx.fillStyle = '#0f172a';
    const bannerFontSize = Math.round(imgWidth * 0.048);
    ctx.font = `700 ${bannerFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const paddingX = Math.round(imgWidth * 0.04);
    const maxBannerTextWidth = canvas.width - paddingX * 2;
    const bannerLines = wrapText(ctx, options.bannerText || '', maxBannerTextWidth);
    const lineHeight = bannerFontSize * 1.25;
    const totalTextHeight = bannerLines.length * lineHeight;
    const startY = (bannerHeight - totalTextHeight) / 2 + lineHeight / 2;

    bannerLines.forEach((line, idx) => {
      ctx.fillText(line, paddingX, startY + idx * lineHeight);
    });
    ctx.restore();
  }

  // 2. Draw Image with CSS filters
  ctx.save();
  ctx.filter = buildFilterString(options.filters);
  ctx.drawImage(img, 0, bannerHeight, imgWidth, imgHeight);
  ctx.restore();

  // If vintage filter, add subtle vignette and warm overlay
  if (options.filters.vintage) {
    ctx.save();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.fillRect(0, bannerHeight, imgWidth, imgHeight);

    // Vignette
    const gradient = ctx.createRadialGradient(
      imgWidth / 2,
      bannerHeight + imgHeight / 2,
      imgWidth * 0.25,
      imgWidth / 2,
      bannerHeight + imgHeight / 2,
      imgWidth * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerHeight, imgWidth, imgHeight);
    ctx.restore();
  }

  // 3. Draw Text Layers
  options.textLayers.forEach((layer) => {
    if (!layer.text || !layer.text.trim()) return;

    ctx.save();
    const rawText = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
    const dynamicFontSize = Math.round((layer.fontSize / 100) * (imgWidth * 0.08));
    const fontName = layer.fontFamily || 'Impact';

    ctx.font = `900 ${dynamicFontSize}px "${fontName}", Impact, sans-serif`;
    ctx.textAlign = layer.align || 'center';
    ctx.textBaseline = 'middle';

    const posX = (layer.x / 100) * imgWidth;
    const posY = bannerHeight + (layer.y / 100) * imgHeight;
    const maxTextWidth = imgWidth * 0.92;

    const lines = wrapText(ctx, rawText, maxTextWidth);
    const lineHeight = dynamicFontSize * 1.15;
    const strokeWidth = Math.max(2, Math.round(dynamicFontSize * (layer.strokeWidth / 100) * 0.2));

    // Optional background box (pill/capsule or rectangular box)
    if (layer.hasBackgroundBox) {
      lines.forEach((line, idx) => {
        const metrics = ctx.measureText(line);
        const boxWidth = metrics.width + dynamicFontSize * 0.6;
        const boxHeight = lineHeight * 0.95;
        const lineY = posY + (idx - (lines.length - 1) / 2) * lineHeight;

        let boxX = posX - boxWidth / 2;
        if (layer.align === 'left') boxX = posX - dynamicFontSize * 0.3;
        if (layer.align === 'right') boxX = posX - boxWidth + dynamicFontSize * 0.3;

        ctx.fillStyle = layer.backgroundColor || 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(boxX, lineY - boxHeight / 2, boxWidth, boxHeight, 8);
        ctx.fill();
      });
    }

    // Draw text with stroke and fill
    lines.forEach((line, idx) => {
      const lineY = posY + (idx - (lines.length - 1) / 2) * lineHeight;

      if (strokeWidth > 0 && layer.strokeColor !== 'transparent') {
        ctx.strokeStyle = layer.strokeColor || '#000000';
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(line, posX, lineY);
      }

      ctx.fillStyle = layer.color || '#ffffff';
      ctx.fillText(line, posX, lineY);
    });

    ctx.restore();
  });

  // 4. Draw Stickers / Emojis
  options.stickers.forEach((sticker) => {
    ctx.save();
    const posX = (sticker.x / 100) * imgWidth;
    const posY = bannerHeight + (sticker.y / 100) * imgHeight;
    const size = Math.round((sticker.size / 100) * (imgWidth * 0.15));

    ctx.translate(posX, posY);
    ctx.rotate((sticker.rotation * Math.PI) / 180);

    ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emojiOrSvg, 0, 0);

    ctx.restore();
  });
}
