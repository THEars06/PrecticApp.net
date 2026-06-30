'use client';

/* eslint-disable @next/next/no-img-element */
import { DragEvent, useRef, useState } from 'react';
import { HeroBlock as HeroBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { uploadImage } from '../uploadImage';
import { mobileButtonFont, mobileButtonPadding } from '../mobileButtonScale';
import BlockFrame from './BlockFrame';

export default function HeroBlock({ block }: { block: HeroBlockType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const device = useTemplate2Store((state) => state.deviceMode);
  const [uploading, setUploading] = useState(false);

  const applyFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      updateBlock(block.id, (current) =>
        current.type === 'hero' ? { ...current, content: { ...current.content, image: url } } : current,
      );
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file) void applyFile(file);
  };

  return (
    <BlockFrame id={block.id} label="Hero">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className={`overflow-hidden rounded-2xl ${device === 'mobile' ? 'm-2' : 'm-6'}`}
        style={{ background: block.style.bgColor, borderRadius: block.style.borderRadius }}
      >
        {block.content.image ? (
          <div>
            <div className="text-center">
              <img
                src={block.content.image}
                alt=""
                className="h-auto max-w-full"
                style={{ width: device === 'mobile' ? '100%' : block.style.imageWidth || '100%', display: 'inline-block' }}
              />
            </div>
            <div className="flex justify-center gap-2 border-b border-black/5 bg-white/60 px-4 py-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Görsel Değiştir
              </button>
              <button
                type="button"
                onClick={() =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, content: { ...current.content, image: '' } } : current,
                  )
                }
                className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Görseli Kaldır
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-b border-dashed border-black/10 px-6 py-8 text-sm text-gray-500 hover:bg-white/40"
          >
            {uploading ? 'Görsel yükleniyor...' : 'Hero görseli sürükle veya seç'}
          </button>
        )}
        <div className="px-8 py-9" style={{ color: block.style.textColor, textAlign: block.style.align, padding: block.style.padding }}>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'hero'
                  ? { ...current, content: { ...current.content, title: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="text-3xl font-extrabold leading-tight outline-none"
          >
            {block.content.title}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'hero'
                  ? { ...current, content: { ...current.content, subtitle: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="mt-3 text-base leading-7 opacity-80 outline-none"
          >
            {block.content.subtitle || 'Alt açıklama'}
          </div>
          {block.content.buttonText ? (
            <span
              className="mt-5 inline-block rounded-lg bg-[#2b2973] font-bold text-white"
              style={{
                padding: mobileButtonPadding('12px 20px', device),
                fontSize: mobileButtonFont('14px', device),
              }}
            >
              {block.content.buttonText}
            </span>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void applyFile(file);
            event.currentTarget.value = '';
          }}
        />
      </div>
    </BlockFrame>
  );
}
