'use client';

/* eslint-disable @next/next/no-img-element */
import { DragEvent, useRef, useState } from 'react';
import { ImageBlock as ImageBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { useImageUpload } from '../ImageUploadContext';
import BlockFrame from './BlockFrame';

export default function ImageBlock({ block }: { block: ImageBlockType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const addButtonBelow = useTemplate2Store((state) => state.addButtonBelow);
  const device = useTemplate2Store((state) => state.deviceMode);
  const { requestCrop } = useImageUpload();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    setUploading(true);
    setError('');
    requestCrop({
      file,
      onComplete: (url) => {
        updateBlock(block.id, (current) =>
          current.type === 'image' ? { ...current, content: { ...current.content, src: url } } : current,
        );
        setUploading(false);
      },
    });
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file) handleFile(file);
  };

  return (
    <BlockFrame id={block.id} label="Görsel" backgroundColor={block.style.blockBg}>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        style={{
          textAlign: block.style.align,
          padding: device === 'mobile' ? '8px 8px' : block.style.padding,
        }}
      >
        {block.content.src ? (
          <>
            <img
              src={block.content.src}
              alt={block.content.alt}
              style={{
                width: device === 'mobile' ? '100%' : block.style.width,
                maxWidth: '100%',
                borderRadius: block.style.borderRadius,
                display: 'inline-block',
              }}
            />
            {block.content.caption ? (
              <div
                className="mt-2 outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image'
                      ? { ...current, content: { ...current.content, caption: event.currentTarget.textContent || '' } }
                      : current,
                  )
                }
                style={{ color: block.style.captionColor, fontSize: block.style.captionFontSize }}
              >
                {block.content.caption}
              </div>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500 hover:border-[#ae256c] hover:bg-purple-50"
          >
            {uploading ? 'Yükleniyor...' : 'Görseli buraya sürükle veya seç'}
          </button>
        )}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {block.content.src ? 'Görsel Değiştir' : 'Görsel Seç'}
          </button>
          {block.content.src ? (
            <>
              <button
                type="button"
                onClick={() => addButtonBelow(block.id)}
                className="rounded-lg border border-[#ae256c]/30 bg-[#ae256c]/5 px-3 py-1.5 text-xs font-semibold text-[#ae256c] hover:bg-[#ae256c]/10"
              >
                Altına Buton Ekle
              </button>
              <button
                type="button"
                onClick={() =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image' ? { ...current, content: { ...current.content, src: '' } } : current,
                  )
                }
                className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Görseli Kaldır
              </button>
            </>
          ) : null}
        </div>
        {error ? <p className="mt-2 text-center text-xs text-red-500">{error}</p> : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.currentTarget.value = '';
          }}
        />
      </div>
    </BlockFrame>
  );
}
