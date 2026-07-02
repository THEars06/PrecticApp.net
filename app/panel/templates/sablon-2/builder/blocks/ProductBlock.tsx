'use client';

/* eslint-disable @next/next/no-img-element */
import { DragEvent, useRef, useState } from 'react';
import { ProductBlock as ProductBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { useImageUpload } from '../ImageUploadContext';
import { mobileButtonFont, mobileButtonPadding } from '../mobileButtonScale';
import { GISE_BRAND } from '../brandColors';
import BlockFrame from './BlockFrame';

export default function ProductBlock({ block }: { block: ProductBlockType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const device = useTemplate2Store((state) => state.deviceMode);
  const { requestCrop } = useImageUpload();
  const [uploading, setUploading] = useState(false);

  const handleFile = (file: File) => {
    setUploading(true);
    requestCrop({
      file,
      onComplete: (url) => {
        updateBlock(block.id, (current) =>
          current.type === 'product' ? { ...current, content: { ...current.content, image: url } } : current,
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
    <BlockFrame id={block.id} label="Ürün Kartı" backgroundColor={block.style.bg}>
      <div className={device === 'mobile' ? 'px-2 py-3' : 'px-6 py-4'}>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          style={{
            background: block.style.bg,
            borderRadius: block.style.borderRadius,
            padding: block.style.padding,
            textAlign: block.style.align,
          }}
          className="border border-gray-100 shadow-sm"
        >
          {block.content.image ? (
            <div className="mb-4">
              <img
                src={block.content.image}
                alt=""
                className="mx-auto max-h-56 max-w-full rounded-xl object-cover"
                style={{ width: device === 'mobile' ? '100%' : block.style.imageWidth || '100%' }}
              />
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Görsel Değiştir
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateBlock(block.id, (current) =>
                      current.type === 'product' ? { ...current, content: { ...current.content, image: '' } } : current,
                    )
                  }
                  className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Görseli Kaldır
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mb-4 w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-500 hover:border-[#ae256c] hover:bg-purple-50"
            >
              {uploading ? 'Yükleniyor...' : 'Ürün görseli ekle'}
            </button>
          )}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'product' ? { ...current, content: { ...current.content, title: event.currentTarget.textContent || '' } } : current,
              )
            }
            className="text-xl font-extrabold outline-none"
            style={{ color: block.style.titleColor }}
          >
            {block.content.title}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'product'
                  ? { ...current, content: { ...current.content, description: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="mt-2 text-sm leading-6 outline-none"
            style={{ color: block.style.textColor }}
          >
            {block.content.description}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'product' ? { ...current, content: { ...current.content, price: event.currentTarget.textContent || '' } } : current,
              )
            }
            className="mt-3 text-2xl font-black outline-none"
            style={{ color: block.style.priceColor }}
          >
            {block.content.price}
          </div>
          <span
            className="inline-block rounded-lg font-bold"
            style={{
              display: 'inline-block',
              marginTop: block.style.buttonMarginTop ?? '16px',
              marginBottom: block.style.buttonMarginBottom ?? '0px',
              background: block.style.buttonBg,
              color: block.style.buttonColor,
              padding: mobileButtonPadding(block.style.buttonPadding ?? '13px 22px', device),
              fontSize: mobileButtonFont(block.style.buttonFontSize ?? '15px', device),
            }}
          >
            {block.content.buttonText}
          </span>
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
      </div>
    </BlockFrame>
  );
}
