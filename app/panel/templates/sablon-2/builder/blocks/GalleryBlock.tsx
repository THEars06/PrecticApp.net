'use client';

/* eslint-disable @next/next/no-img-element */
import { DragEvent, useRef, useState } from 'react';
import { GalleryBlock as GalleryBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { uploadImage } from '../uploadImage';
import { mobileButtonFont, mobileButtonMinHeight, mobileButtonPadding } from '../mobileButtonScale';
import BlockFrame from './BlockFrame';

function galleryButtonStyle(block: GalleryBlockType, device: 'desktop' | 'mobile') {
  return {
    buttonBg: block.style.buttonBg ?? '#2b2973',
    buttonColor: block.style.buttonColor ?? '#ffffff',
    buttonRadius: block.style.buttonRadius ?? '8px',
    buttonFontSize: mobileButtonFont(block.style.buttonFontSize ?? '12px', device),
    buttonPadding: mobileButtonPadding(block.style.buttonPadding ?? '8px 12px', device),
    buttonMinHeight: mobileButtonMinHeight('36px', device),
  };
}

function imageShowsButton(block: GalleryBlockType, showButton?: boolean) {
  return (block.content.showButtons ?? true) && showButton !== false;
}

export default function GalleryBlock({ block }: { block: GalleryBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const device = useTemplate2Store((state) => state.deviceMode);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const btnStyle = galleryButtonStyle(block, device);
  const columnCount = block.style.columns;
  const visibleImages = block.content.images.slice(0, block.style.columns);

  const applyFile = async (imageId: string, file: File) => {
    setUploadingId(imageId);
    setError('');
    try {
      const url = await uploadImage(file);
      updateBlock(block.id, (current) =>
        current.type === 'gallery'
          ? {
              ...current,
              content: {
                ...current.content,
                images: current.content.images.map((image) => (image.id === imageId ? { ...image, src: url } : image)),
              },
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görsel yüklenemedi.');
    } finally {
      setUploadingId(null);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, imageId: string) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file) void applyFile(imageId, file);
  };

  return (
    <BlockFrame id={block.id} label="Yan Yana Görsel">
      <div style={{ padding: device === 'mobile' ? '8px 8px' : block.style.padding }}>
        <div
          className="grid items-stretch"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            gap: device === 'mobile' ? '8px' : block.style.gap,
            textAlign: block.style.align,
          }}
        >
          {visibleImages.map((image, index) => {
            const buttonText = image.buttonText ?? 'Tıkla';
            const buttonUrl = image.buttonUrl ?? '#';
            const showBtn = imageShowsButton(block, image.showButton);

            return (
              <div
                key={image.id}
                className="flex h-full min-h-0 flex-col"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, image.id)}
              >
                <div className="shrink-0">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        width: device === 'mobile' ? '100%' : image.width || block.style.imageWidth,
                        maxWidth: '100%',
                        borderRadius: block.style.borderRadius,
                        display: 'inline-block',
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => inputRefs.current[image.id]?.click()}
                      className="min-h-32 w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-500 hover:border-[#2b2973] hover:bg-purple-50"
                    >
                      {uploadingId === image.id ? 'Yükleniyor...' : `Görsel ${index + 1}`}
                    </button>
                  )}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(event) =>
                    updateBlock(block.id, (current) =>
                      current.type === 'gallery'
                        ? {
                            ...current,
                            content: {
                              ...current.content,
                              images: current.content.images.map((item) =>
                                item.id === image.id ? { ...item, caption: event.currentTarget.textContent || '' } : item,
                              ),
                            },
                          }
                        : current,
                    )
                  }
                  className="mt-2 min-h-[44px] shrink-0 outline-none"
                  style={{ color: block.style.captionColor, fontSize: block.style.captionFontSize, lineHeight: 1.4 }}
                >
                  {image.caption || 'Alt yazı'}
                </div>
                <div className="min-h-0 flex-1" aria-hidden />
                {showBtn ? (
                  <div className="shrink-0 pt-2 text-center">
                    <a
                      href={buttonUrl}
                      onClick={(event) => event.preventDefault()}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        updateBlock(block.id, (current) =>
                          current.type === 'gallery'
                            ? {
                                ...current,
                                content: {
                                  ...current.content,
                                  images: current.content.images.map((item) =>
                                    item.id === image.id
                                      ? {
                                          ...item,
                                          showButton: true,
                                          buttonText: event.currentTarget.textContent?.trim() || 'Tıkla',
                                        }
                                      : item,
                                  ),
                                },
                              }
                            : current,
                        )
                      }
                      style={{
                        display: 'inline-block',
                        width: 'auto',
                        maxWidth: '100%',
                        minHeight: btnStyle.buttonMinHeight,
                        background: btnStyle.buttonBg,
                        color: btnStyle.buttonColor,
                        borderRadius: btnStyle.buttonRadius,
                        padding: btnStyle.buttonPadding,
                        fontSize: btnStyle.buttonFontSize,
                        textDecoration: 'none',
                        fontWeight: 700,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        boxSizing: 'border-box',
                        verticalAlign: 'middle',
                      }}
                      className="mx-auto inline-flex w-auto max-w-full items-center justify-center outline-none"
                    >
                      {buttonText}
                    </a>
                  </div>
                ) : (
                  <div className="shrink-0 pt-2" aria-hidden />
                )}
                <div className="mt-2 flex shrink-0 justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => inputRefs.current[image.id]?.click()}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Değiştir
                  </button>
                  {image.src ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateBlock(block.id, (current) =>
                          current.type === 'gallery'
                            ? {
                                ...current,
                                content: {
                                  ...current.content,
                                  images: current.content.images.map((item) =>
                                    item.id === image.id ? { ...item, src: '' } : item,
                                  ),
                                },
                              }
                            : current,
                        )
                      }
                      className="rounded-lg border border-red-100 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                    >
                      Kaldır
                    </button>
                  ) : null}
                </div>
                <input
                  ref={(element) => {
                    inputRefs.current[image.id] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void applyFile(image.id, file);
                    event.currentTarget.value = '';
                  }}
                />
              </div>
            );
          })}
        </div>
        {error ? <p className="mt-2 text-center text-xs text-red-500">{error}</p> : null}
      </div>
    </BlockFrame>
  );
}
