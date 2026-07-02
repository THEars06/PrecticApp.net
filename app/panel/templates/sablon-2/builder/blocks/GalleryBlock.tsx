'use client';

/* eslint-disable @next/next/no-img-element */
import { DragEvent, useRef, useState } from 'react';
import { GalleryBlock as GalleryBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { useImageUpload } from '../ImageUploadContext';
import { galleryCaptionsEnabled } from '../blockStyle';
import { aspectToCssRatio } from '../parsePadding';
import { mobileButtonFont, mobileButtonMinHeight, mobileButtonPadding } from '../mobileButtonScale';
import { resolveGalleryButtonUrl } from '../galleryLinkUtils';
import { GISE_BRAND } from '../brandColors';
import BlockFrame from './BlockFrame';

const GALLERY_DEFAULT_BUTTON = 'Satın Al';

function galleryButtonStyle(block: GalleryBlockType, device: 'desktop' | 'mobile') {
  return {
    buttonBg: block.style.buttonBg ?? GISE_BRAND.primary,
    buttonColor: block.style.buttonColor ?? GISE_BRAND.white,
    buttonRadius: block.style.buttonRadius ?? '8px',
    buttonFontSize: mobileButtonFont(block.style.buttonFontSize ?? '12px', device),
    buttonPadding: mobileButtonPadding(block.style.buttonPadding ?? '8px 12px', device),
    buttonMinHeight: mobileButtonMinHeight('36px', device),
  };
}

function imageShowsButton(block: GalleryBlockType, showButton?: boolean) {
  return (block.content.showButtons ?? true) && showButton !== false;
}

function syncCaptionsEnabled(images: GalleryBlockType['content']['images'], columns: number) {
  const visible = images.slice(0, columns);
  const enabled = visible.some((image) => Boolean(image.caption?.trim()));
  return enabled;
}

export default function GalleryBlock({ block }: { block: GalleryBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const device = useTemplate2Store((state) => state.deviceMode);
  const { requestCrop } = useImageUpload();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const btnStyle = galleryButtonStyle(block, device);
  const columnCount = block.style.columns;
  const visibleImages = block.content.images.slice(0, block.style.columns);
  const showCaptions = galleryCaptionsEnabled(block);
  const aspectRatio = block.style.imageAspectRatio || aspectToCssRatio(block.style.cropAspect ?? 1) || '1 / 1';
  const blockBg = block.style.blockBg;

  const applyUrl = (imageId: string, url: string, cropAspect?: number) => {
    updateBlock(block.id, (current) => {
      if (current.type !== 'gallery') return current;
      const nextAspect = cropAspect ?? current.style.cropAspect ?? 1;
      return {
        ...current,
        content: {
          ...current.content,
          images: current.content.images.map((image) => (image.id === imageId ? { ...image, src: url } : image)),
        },
        style: {
          ...current.style,
          cropAspect: nextAspect,
          imageAspectRatio: aspectToCssRatio(nextAspect) || '1 / 1',
        },
      };
    });
  };

  const handleFile = (imageId: string, file: File) => {
    const lockedAspect = block.style.cropAspect ?? 1;
    const hasExisting = block.content.images.some((image) => image.src);
    requestCrop({
      file,
      defaultAspect: hasExisting ? lockedAspect : 1,
      lockAspect: hasExisting,
      onComplete: (url, width, height) => {
        const aspect = width > 0 && height > 0 ? width / height : lockedAspect;
        applyUrl(imageId, url, hasExisting ? lockedAspect : aspect);
        setUploadingId(null);
      },
      onCancel: () => setUploadingId(null),
    });
    setUploadingId(imageId);
    setError('');
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, imageId: string) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file) handleFile(imageId, file);
  };

  const updateCaption = (imageId: string, caption: string) => {
    updateBlock(block.id, (current) => {
      if (current.type !== 'gallery') return current;
      const images = current.content.images.map((item) => (item.id === imageId ? { ...item, caption } : item));
      const captionsEnabled = syncCaptionsEnabled(images, current.style.columns);
      return {
        ...current,
        content: { ...current.content, images, captionsEnabled },
      };
    });
  };

  return (
    <BlockFrame id={block.id} label="Yan Yana Görsel" backgroundColor={blockBg}>
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
            const buttonText = image.buttonText ?? GALLERY_DEFAULT_BUTTON;
            const buttonUrl = resolveGalleryButtonUrl(image);
            const imageLink = image.link?.trim();
            const showBtn = imageShowsButton(block, image.showButton);

            const imageNode = image.src ? (
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: block.style.borderRadius,
                }}
              />
            ) : null;

            return (
              <div
                key={image.id}
                className="flex h-full min-h-0 flex-col"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, image.id)}
              >
                <div className="shrink-0">
                  {image.src ? (
                    <div style={{ aspectRatio, width: '100%', overflow: 'hidden', borderRadius: block.style.borderRadius }}>
                      {imageLink ? (
                        <a
                          href={imageLink}
                          onClick={(event) => event.preventDefault()}
                          style={{ display: 'block', textDecoration: 'none' }}
                        >
                          {imageNode}
                        </a>
                      ) : (
                        imageNode
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => inputRefs.current[image.id]?.click()}
                      className="min-h-32 w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-500 hover:border-[#ae256c] hover:bg-purple-50"
                      style={{ aspectRatio }}
                    >
                      {uploadingId === image.id ? 'Yükleniyor...' : `Görsel ${index + 1}`}
                    </button>
                  )}
                </div>
                {showCaptions ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => updateCaption(image.id, event.currentTarget.textContent?.trim() || '')}
                    className="mt-2 min-h-[44px] shrink-0 outline-none"
                    style={{ color: block.style.captionColor, fontSize: block.style.captionFontSize, lineHeight: 1.4 }}
                  >
                    {image.caption || 'Alt yazı (zorunlu)'}
                  </div>
                ) : null}
                {!showCaptions ? null : <div className="min-h-0 flex-1" aria-hidden />}
                {showBtn ? (
                  <div
                    className="shrink-0 text-center"
                    style={{
                      paddingTop: block.style.buttonMarginTop ?? (showCaptions ? '8px' : '4px'),
                      paddingBottom: block.style.buttonMarginBottom ?? '0px',
                    }}
                  >
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
                                          buttonText: event.currentTarget.textContent?.trim() || GALLERY_DEFAULT_BUTTON,
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
                ) : null}
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
                    if (file) handleFile(image.id, file);
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
