'use client';

import { useDraggable } from '@dnd-kit/core';
import { BlockType } from './types';

const blocks: Array<{ type: BlockType; label: string; description: string }> = [
  { type: 'heading', label: 'Başlık', description: 'H1/H2/H3 metin' },
  { type: 'text', label: 'Metin', description: 'Paragraf içeriği' },
  { type: 'image', label: 'Görsel', description: 'Fotoğraf — seçince altına buton ekleyebilirsin' },
  { type: 'button', label: 'Buton', description: 'CTA butonu — canvas\'a sürükle' },
  { type: 'gallery', label: 'Yan Yana Görsel', description: '2-5 fotoğraf, her birinin altında buton' },
  { type: 'hero', label: 'Hero Banner', description: 'Görsel, yazı ve buton bir arada' },
  { type: 'coupon', label: 'Kupon / Kod', description: 'İndirim kodu kutusu' },
  { type: 'product', label: 'Ürün Kartı', description: 'Görsel, fiyat, buton' },
  { type: 'social', label: 'Sosyal Linkler', description: 'Instagram, site, LinkedIn' },
  { type: 'footer', label: 'Footer', description: 'Alt bilgi ve linkler' },
  { type: 'divider', label: 'Ayırıcı', description: 'İnce çizgi' },
  { type: 'spacer', label: 'Boşluk', description: 'Dikey aralık' },
  { type: 'columns', label: '2 Kolon', description: 'Yan yana içerik' },
];

function PaletteItem({ type, label, description }: { type: BlockType; label: string; description: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `palette:${type}` });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className={`w-full rounded-xl border border-gray-200 bg-white p-3 text-left transition-all hover:border-[#2b2973] hover:shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-sm font-semibold text-gray-900">{label}</div>
      <div className="mt-1 text-xs text-gray-500">{description}</div>
    </button>
  );
}

export default function BlockPalette() {
  return (
    <aside className="h-full min-h-0 overflow-y-auto overscroll-contain border-r border-gray-200 bg-gray-50 p-4 pb-28">
      <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 border-b border-gray-200 bg-gray-50 px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900">Bloklar</h2>
        <p className="mt-1 text-xs text-gray-500">Canvas'a sürükle bırak.</p>
      </div>
      <div className="space-y-2">
        {blocks.map((block) => (
          <PaletteItem key={block.type} {...block} />
        ))}
      </div>
    </aside>
  );
}
