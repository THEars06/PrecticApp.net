'use client';

import { nanoid } from 'nanoid';
import { GalleryColumns, GalleryImage, SocialLink, SocialPlatform, TemplateBlock } from './types';
import { useTemplate2Store } from './store';
import { ensureUrlProtocol } from './validators';

function findBlock(blocks: TemplateBlock[], id: string | null): TemplateBlock | null {
  if (!id) return null;
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.type === 'columns') {
      const nested = findBlock([...block.content.left, ...block.content.right], id);
      if (nested) return nested;
    }
  }
  return null;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#2b2973]';
const colorInputClass = 'h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white p-1';
const socialPlatformOptions: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X' },
  { value: 'website', label: 'Website' },
  { value: 'linkedin', label: 'LinkedIn' },
];

function inferSocialPlatform(link: SocialLink): SocialPlatform {
  const value = `${link.platform || ''} ${link.label || ''} ${link.url || ''}`.toLowerCase();
  if (value.includes('instagram')) return 'instagram';
  if (value.includes('facebook') || value.includes('fb.com')) return 'facebook';
  if (value.includes('twitter') || value.includes('x.com') || value.trim() === 'x') return 'x';
  if (value.includes('linkedin')) return 'linkedin';
  return 'website';
}

function colorPickerValue(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input type="color" value={colorPickerValue(value, fallback)} onChange={(event) => onChange(event.target.value)} className={colorInputClass} />
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} placeholder={fallback} />
      </div>
    </Field>
  );
}

function TemplateAppearanceControls({
  bgColor,
  contentBgColor,
  contentWidth,
  fontFamily,
  setSettings,
  compact = false,
}: {
  bgColor: string;
  contentBgColor: string;
  contentWidth: number;
  fontFamily: string;
  setSettings: ReturnType<typeof useTemplate2Store.getState>['setSettings'];
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'rounded-xl border border-purple-100 bg-purple-50/50 p-3' : ''}>
      {compact ? (
        <div className="mb-3">
          <h3 className="text-xs font-bold text-gray-800">Şablon Arka Planı</h3>
          <p className="mt-1 text-[11px] text-gray-500">Tüm mailin dış ve içerik arka plan rengini buradan ayarla.</p>
        </div>
      ) : null}
      <div className="space-y-4">
        <ColorField label="Dış arka plan rengi" value={bgColor} fallback="#f3f4f6" onChange={(value) => setSettings({ bgColor: value })} />
        <ColorField
          label="İçerik arka plan rengi"
          value={contentBgColor}
          fallback="#ffffff"
          onChange={(value) => setSettings({ contentBgColor: value })}
        />
        {!compact ? (
          <>
            <Field label="İçerik genişliği">
              <input
                type="number"
                min={320}
                max={800}
                value={contentWidth}
                onChange={(event) => setSettings({ contentWidth: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Font">
              <select value={fontFamily} onChange={(event) => setSettings({ fontFamily: event.target.value })} className={inputClass}>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Trebuchet MS', Arial, sans-serif">Trebuchet</option>
                <option value="'Courier New', monospace">Courier</option>
              </select>
            </Field>
          </>
        ) : null}
      </div>
    </div>
  );
}

function createGalleryImage(index: number): GalleryImage {
  return {
    id: `gallery-image-${nanoid(8)}`,
    src: '',
    alt: `Görsel ${index + 1}`,
    width: '100%',
    caption: `Açıklama ${index + 1}`,
    showButton: true,
    buttonText: 'Tıkla',
    buttonUrl: 'https://example.com',
    buttonTarget: '_blank',
  };
}

function resizeGalleryImages(images: GalleryImage[], count: number): GalleryImage[] {
  if (images.length === count) return images;
  if (images.length > count) return images.slice(0, count);
  return [...images, ...Array.from({ length: count - images.length }, (_, index) => createGalleryImage(images.length + index))];
}

export default function Inspector() {
  const design = useTemplate2Store((state) => state.design);
  const selectedId = useTemplate2Store((state) => state.selectedId);
  const setSettings = useTemplate2Store((state) => state.setSettings);
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const addButtonBelow = useTemplate2Store((state) => state.addButtonBelow);
  const block = findBlock(design.blocks, selectedId);

  if (!block) {
    return (
      <aside className="h-full min-h-0 overflow-y-auto overscroll-contain border-l border-gray-200 bg-white p-4 pb-28">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 border-b border-gray-200 bg-white px-4 py-4">
          <h2 className="text-sm font-bold text-gray-900">Şablon Ayarları</h2>
        </div>
        <div className="mt-4 space-y-4">
          <TemplateAppearanceControls
            bgColor={design.settings.bgColor}
            contentBgColor={design.settings.contentBgColor}
            contentWidth={design.settings.contentWidth}
            fontFamily={design.settings.fontFamily}
            setSettings={setSettings}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full min-h-0 overflow-y-auto overscroll-contain border-l border-gray-200 bg-white p-4 pb-28">
      <div className="sticky top-0 z-10 -mx-4 -mt-4 border-b border-gray-200 bg-white px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900">Seçili Blok</h2>
        <p className="mt-1 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-500">{block.type}</p>
      </div>

      <div className="mt-4 space-y-4">
        <TemplateAppearanceControls
          bgColor={design.settings.bgColor}
          contentBgColor={design.settings.contentBgColor}
          contentWidth={design.settings.contentWidth}
          fontFamily={design.settings.fontFamily}
          setSettings={setSettings}
          compact
        />

        {block.type === 'heading' ? (
          <>
            <Field label="Başlık seviyesi">
              <select
                value={block.content.level}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'heading' ? { ...current, content: { ...current.content, level: Number(event.target.value) as 1 | 2 | 3 } } : current,
                  )
                }
                className={inputClass}
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </Field>
            <TextStyleControls block={block} />
          </>
        ) : null}

        {block.type === 'text' ? <TextStyleControls block={block} /> : null}

        {block.type === 'image' ? (
          <>
            <Field label="Görsel URL">
              <input
                value={block.content.src}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image' ? { ...current, content: { ...current.content, src: ensureUrlProtocol(event.target.value) } } : current,
                  )
                }
                placeholder="https://site.com/gorsel.jpg"
                className={inputClass}
              />
            </Field>
            <Field label="Alt metin">
              <input
                value={block.content.alt}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image' ? { ...current, content: { ...current.content, alt: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Alt yazı">
              <input
                value={block.content.caption || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image' ? { ...current, content: { ...current.content, caption: event.target.value } } : current,
                  )
                }
                placeholder="Görselin altında görünecek yazı"
                className={inputClass}
              />
            </Field>
            <Field label="Görsele tıklama linki">
              <input
                value={block.content.link || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'image' ? { ...current, content: { ...current.content, link: ensureUrlProtocol(event.target.value) } } : current,
                  )
                }
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
            <ImageStyleControls block={block} />
            <button
              type="button"
              onClick={() => addButtonBelow(block.id)}
              className="w-full rounded-xl bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] px-4 py-2.5 text-sm font-semibold text-white hover:shadow-md transition-all"
            >
              Görselin Altına Buton Ekle
            </button>
          </>
        ) : null}

        {block.type === 'gallery' ? <GalleryControls block={block} /> : null}

        {block.type === 'hero' ? (
          <>
            <Field label="Hero görsel URL">
              <input
                value={block.content.image || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, content: { ...current.content, image: ensureUrlProtocol(event.target.value) } } : current,
                  )
                }
                placeholder="https://site.com/hero.jpg"
                className={inputClass}
              />
            </Field>
            <Field label="Buton yazısı">
              <input
                value={block.content.buttonText || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, content: { ...current.content, buttonText: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Buton linki">
              <input
                value={block.content.buttonUrl || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, content: { ...current.content, buttonUrl: ensureUrlProtocol(event.target.value) } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Hero görsel boyutu">
              <input
                type="range"
                min={20}
                max={100}
                value={Number.parseInt(block.style.imageWidth || '100%', 10) || 100}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, style: { ...current.style, imageWidth: `${event.target.value}%` } } : current,
                  )
                }
                className="w-full"
              />
              <span className="mt-1 block text-xs text-gray-500">{block.style.imageWidth || '100%'}</span>
            </Field>
            <Field label="Arka plan rengi">
              <input
                type="color"
                value={block.style.bgColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, style: { ...current.style, bgColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Yazı rengi">
              <input
                type="color"
                value={block.style.textColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, style: { ...current.style, textColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <AlignControl block={block} />
            <Field label="Padding">
              <input
                value={block.style.padding}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'hero' ? { ...current, style: { ...current.style, padding: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
          </>
        ) : null}

        {block.type === 'button' ? (
          <>
            <Field label="Link">
              <input
                value={block.content.url}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'button' ? { ...current, content: { ...current.content, url: ensureUrlProtocol(event.target.value) } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Buton rengi">
              <input
                type="color"
                value={block.style.bg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'button' ? { ...current, style: { ...current.style, bg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <TextStyleControls block={block} />
          </>
        ) : null}

        {block.type === 'coupon' ? (
          <>
            <Field label="Kupon kodu">
              <input
                value={block.content.code}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'coupon' ? { ...current, content: { ...current.content, code: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Arka plan">
              <input
                type="color"
                value={block.style.bg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'coupon' ? { ...current, style: { ...current.style, bg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Çerçeve rengi">
              <input
                type="color"
                value={block.style.borderColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'coupon' ? { ...current, style: { ...current.style, borderColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Kod rengi">
              <input
                type="color"
                value={block.style.codeColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'coupon' ? { ...current, style: { ...current.style, codeColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Kod boyutu">
              <input
                type="range"
                min={18}
                max={48}
                value={Number.parseInt(block.style.codeFontSize, 10) || 28}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'coupon' ? { ...current, style: { ...current.style, codeFontSize: `${event.target.value}px` } } : current,
                  )
                }
                className="w-full"
              />
              <span className="mt-1 block text-xs text-gray-500">{block.style.codeFontSize}</span>
            </Field>
            <AlignControl block={block} />
          </>
        ) : null}

        {block.type === 'footer' ? (
          <>
            <Field label="Abonelikten çık metni">
              <input
                value={block.content.unsubscribeText}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer'
                      ? { ...current, content: { ...current.content, unsubscribeText: event.target.value } }
                      : current,
                  )
                }
                placeholder="Abonelikten çık"
                className={inputClass}
              />
            </Field>
            <Field label="Abonelikten çık linki">
              <input
                value={block.content.unsubscribeUrl}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer'
                      ? { ...current, content: { ...current.content, unsubscribeUrl: ensureUrlProtocol(event.target.value) } }
                      : current,
                  )
                }
                placeholder="{{UNSUBSCRIBE_URL}}"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                Otomatik doldurulur — <code>{'{{UNSUBSCRIBE_URL}}'}</code> bırakın. Önizlemede örnek link açılır; gerçek mailde kişiye özel olur.
              </p>
            </Field>
            <Field label="Arka plan">
              <input
                type="color"
                value={block.style.bg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer' ? { ...current, style: { ...current.style, bg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Yazı rengi">
              <input
                type="color"
                value={block.style.color}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer' ? { ...current, style: { ...current.style, color: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Buton rengi">
              <input
                type="color"
                value={block.style.linkColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer' ? { ...current, style: { ...current.style, linkColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Font boyutu">
              <input
                value={block.style.fontSize}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'footer' ? { ...current, style: { ...current.style, fontSize: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <AlignControl block={block} />
          </>
        ) : null}

        {block.type === 'product' ? (
          <>
            <Field label="Ürün görsel URL">
              <input
                value={block.content.image || ''}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product'
                      ? { ...current, content: { ...current.content, image: ensureUrlProtocol(event.target.value) } }
                      : current,
                  )
                }
                placeholder="https://site.com/urun.jpg"
                className={inputClass}
              />
            </Field>
            <Field label="Buton yazısı">
              <input
                value={block.content.buttonText}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, content: { ...current.content, buttonText: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Buton linki">
              <input
                value={block.content.buttonUrl}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product'
                      ? { ...current, content: { ...current.content, buttonUrl: ensureUrlProtocol(event.target.value) } }
                      : current,
                  )
                }
                className={inputClass}
              />
            </Field>
            <Field label="Ürün görsel boyutu">
              <input
                type="range"
                min={20}
                max={100}
                value={Number.parseInt(block.style.imageWidth || '100%', 10) || 100}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, style: { ...current.style, imageWidth: `${event.target.value}%` } } : current,
                  )
                }
                className="w-full"
              />
              <span className="mt-1 block text-xs text-gray-500">{block.style.imageWidth || '100%'}</span>
            </Field>
            <Field label="Arka plan">
              <input
                type="color"
                value={block.style.bg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, style: { ...current.style, bg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Başlık rengi">
              <input
                type="color"
                value={block.style.titleColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, style: { ...current.style, titleColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Fiyat rengi">
              <input
                type="color"
                value={block.style.priceColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, style: { ...current.style, priceColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Buton rengi">
              <input
                type="color"
                value={block.style.buttonBg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'product' ? { ...current, style: { ...current.style, buttonBg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <AlignControl block={block} />
          </>
        ) : null}

        {block.type === 'social' ? (
          <>
            <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs font-bold text-gray-600">Sosyal Linkler</div>
              {block.content.links.map((link) => (
                <div key={link.id} className="space-y-2 rounded-lg bg-white p-3">
                  <select
                    value={inferSocialPlatform(link)}
                    onChange={(event) =>
                      updateBlock(block.id, (current) =>
                        current.type === 'social'
                          ? {
                              ...current,
                              content: {
                                ...current.content,
                                links: current.content.links.map((item) => {
                                  if (item.id !== link.id) return item;
                                  const platform = event.target.value as SocialPlatform;
                                  const label = socialPlatformOptions.find((option) => option.value === platform)?.label || item.label;
                                  return { ...item, platform, label };
                                }),
                              },
                            }
                          : current,
                      )
                    }
                    className={inputClass}
                  >
                    {socialPlatformOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={link.url}
                    onChange={(event) =>
                      updateBlock(block.id, (current) =>
                        current.type === 'social'
                          ? {
                              ...current,
                              content: {
                                ...current.content,
                                links: current.content.links.map((item) =>
                                  item.id === link.id ? { ...item, url: ensureUrlProtocol(event.target.value) } : item,
                                ),
                              },
                            }
                          : current,
                      )
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
            <Field label="Arka plan">
              <input
                type="color"
                value={block.style.bg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'social' ? { ...current, style: { ...current.style, bg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Link arka planı">
              <input
                type="color"
                value={block.style.linkBg}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'social' ? { ...current, style: { ...current.style, linkBg: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Link rengi">
              <input
                type="color"
                value={block.style.linkColor}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'social' ? { ...current, style: { ...current.style, linkColor: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <AlignControl block={block} />
          </>
        ) : null}

        {block.type === 'divider' ? (
          <>
            <Field label="Renk">
              <input
                type="color"
                value={block.style.color}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'divider' ? { ...current, style: { ...current.style, color: event.target.value } } : current,
                  )
                }
                className="h-10 w-full"
              />
            </Field>
            <Field label="Kalınlık">
              <input
                value={block.style.thickness}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'divider' ? { ...current, style: { ...current.style, thickness: event.target.value } } : current,
                  )
                }
                className={inputClass}
              />
            </Field>
          </>
        ) : null}

        {block.type === 'spacer' ? (
          <Field label="Yükseklik">
            <input
              value={block.style.height}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'spacer' ? { ...current, style: { ...current.style, height: event.target.value } } : current,
                )
              }
              className={inputClass}
            />
          </Field>
        ) : null}
      </div>
    </aside>
  );
}

function AlignControl({ block }: { block: Extract<TemplateBlock, { style: { align: string } }> }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  return (
    <Field label="Hizalama">
      <select
        value={block.style.align}
        onChange={(event) =>
          updateBlock(block.id, (current) =>
            'align' in current.style
              ? ({ ...current, style: { ...current.style, align: event.target.value as 'left' | 'center' | 'right' } } as TemplateBlock)
              : current,
          )
        }
        className={inputClass}
      >
        <option value="left">Sol</option>
        <option value="center">Orta</option>
        <option value="right">Sağ</option>
      </select>
    </Field>
  );
}

function TextStyleControls({ block }: { block: Extract<TemplateBlock, { style: { color: string; fontSize?: string; align: string } }> }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  return (
    <>
      <Field label="Yazı rengi">
        <input
          type="color"
          value={block.style.color}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              'color' in current.style ? ({ ...current, style: { ...current.style, color: event.target.value } } as TemplateBlock) : current,
            )
          }
          className="h-10 w-full"
        />
      </Field>
      {'fontSize' in block.style ? (
        <Field label="Font boyutu">
          <input
            type="range"
            min={10}
            max={64}
            value={Number.parseInt(block.style.fontSize, 10) || 16}
            onChange={(event) =>
              updateBlock(block.id, (current) =>
                'fontSize' in current.style
                  ? ({ ...current, style: { ...current.style, fontSize: `${event.target.value}px` } } as TemplateBlock)
                  : current,
              )
            }
            className="w-full"
          />
          <span className="mt-1 block text-xs text-gray-500">{block.style.fontSize}</span>
        </Field>
      ) : null}
      <AlignControl block={block} />
    </>
  );
}

function ImageStyleControls({ block }: { block: Extract<TemplateBlock, { type: 'image' }> }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  return (
    <>
      <Field label="Genişlik">
        <input
          type="range"
          min={20}
          max={100}
          value={Number.parseInt(block.style.width, 10) || 100}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'image' ? { ...current, style: { ...current.style, width: `${event.target.value}%` } } : current,
            )
          }
          className="w-full"
        />
        <span className="mt-1 block text-xs text-gray-500">{block.style.width}</span>
      </Field>
      <Field label="Radius">
        <input
          value={block.style.borderRadius}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'image' ? { ...current, style: { ...current.style, borderRadius: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
      <Field label="Padding">
        <input
          value={block.style.padding}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'image' ? { ...current, style: { ...current.style, padding: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
      <AlignControl block={block} />
      <Field label="Alt yazı rengi">
        <input
          type="color"
          value={block.style.captionColor}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'image' ? { ...current, style: { ...current.style, captionColor: event.target.value } } : current,
            )
          }
          className="h-10 w-full"
        />
      </Field>
      <Field label="Alt yazı boyutu">
        <input
          value={block.style.captionFontSize}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'image' ? { ...current, style: { ...current.style, captionFontSize: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
    </>
  );
}

function GalleryControls({ block }: { block: Extract<TemplateBlock, { type: 'gallery' }> }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <>
      <Field label="Galeri tipi">
        <select
          value={block.style.columns}
          onChange={(event) => {
            const columns = Number(event.target.value) as GalleryColumns;
            updateBlock(block.id, (current) =>
              current.type === 'gallery'
                ? {
                    ...current,
                    content: {
                      ...current.content,
                      images: resizeGalleryImages(current.content.images, columns),
                    },
                    style: { ...current.style, columns },
                  }
                : current,
            );
          }}
          className={inputClass}
        >
          <option value={2}>2'li Görsel</option>
          <option value={3}>3'lü Görsel</option>
          <option value={4}>4'lü Görsel</option>
          <option value={5}>5'li Görsel</option>
        </select>
      </Field>
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <div className="text-xs font-bold text-gray-600">Görsel Altı Butonlar</div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={block.content.showButtons ?? true}
            onChange={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'gallery'
                  ? { ...current, content: { ...current.content, showButtons: event.target.checked } }
                  : current,
              )
            }
            className="rounded border-gray-300"
          />
          Her görselin altında buton göster
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Buton rengi</span>
            <input
              type="color"
              value={block.style.buttonBg ?? '#2b2973'}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? { ...current, style: { ...current.style, buttonBg: event.target.value } }
                    : current,
                )
              }
              className={colorInputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Yazı rengi</span>
            <input
              type="color"
              value={block.style.buttonColor ?? '#ffffff'}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? { ...current, style: { ...current.style, buttonColor: event.target.value } }
                    : current,
                )
              }
              className={colorInputClass}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">Yazı boyutu</span>
            <input
              value={block.style.buttonFontSize ?? '12px'}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? { ...current, style: { ...current.style, buttonFontSize: event.target.value } }
                    : current,
                )
              }
              className={inputClass}
              placeholder="12px"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-500">İç boşluk</span>
            <input
              value={block.style.buttonPadding ?? '8px 12px'}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? { ...current, style: { ...current.style, buttonPadding: event.target.value } }
                    : current,
                )
              }
              className={inputClass}
              placeholder="8px 12px"
            />
          </label>
        </div>
      </div>
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <div className="text-xs font-bold text-gray-600">Görsel URL, Link ve Butonlar</div>
        {block.content.images.slice(0, block.style.columns).map((image, index) => (
          <div key={image.id} className="space-y-2 rounded-lg bg-white p-3">
            <div className="text-xs font-semibold text-gray-500">Görsel {index + 1}</div>
            <input
              value={image.src}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? {
                        ...current,
                        content: {
                          ...current.content,
                          images: current.content.images.map((item) =>
                            item.id === image.id ? { ...item, src: ensureUrlProtocol(event.target.value) } : item,
                          ),
                        },
                      }
                    : current,
                )
              }
              className={inputClass}
              placeholder="Görsel URL: https://..."
            />
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-gray-500">Bu görselin boyutu</span>
              <input
                type="range"
                min={20}
                max={100}
                value={Number.parseInt(image.width || block.style.imageWidth, 10) || 100}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'gallery'
                      ? {
                          ...current,
                          content: {
                            ...current.content,
                            images: current.content.images.map((item) =>
                              item.id === image.id ? { ...item, width: `${event.target.value}%` } : item,
                            ),
                          },
                        }
                      : current,
                  )
                }
                className="w-full"
              />
              <span className="text-[11px] text-gray-400">{image.width || block.style.imageWidth}</span>
            </label>
            <input
              value={image.link || ''}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? {
                        ...current,
                        content: {
                          ...current.content,
                          images: current.content.images.map((item) =>
                            item.id === image.id ? { ...item, link: ensureUrlProtocol(event.target.value) } : item,
                          ),
                        },
                      }
                    : current,
                )
              }
              className={inputClass}
              placeholder="Tıklama linki: https://..."
            />
            <input
              value={image.caption || ''}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? {
                        ...current,
                        content: {
                          ...current.content,
                          images: current.content.images.map((item) =>
                            item.id === image.id ? { ...item, caption: event.target.value } : item,
                          ),
                        },
                      }
                    : current,
                )
              }
              className={inputClass}
              placeholder="Alt yazı"
            />
            <input
              value={image.buttonText ?? 'Tıkla'}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? {
                        ...current,
                        content: {
                          ...current.content,
                          images: current.content.images.map((item) =>
                            item.id === image.id ? { ...item, buttonText: event.target.value, showButton: true } : item,
                          ),
                        },
                      }
                    : current,
                )
              }
              className={inputClass}
              placeholder="Buton yazısı"
            />
            <input
              value={image.buttonUrl ?? ''}
              onChange={(event) =>
                updateBlock(block.id, (current) =>
                  current.type === 'gallery'
                    ? {
                        ...current,
                        content: {
                          ...current.content,
                          images: current.content.images.map((item) =>
                            item.id === image.id
                              ? { ...item, buttonUrl: ensureUrlProtocol(event.target.value), showButton: true }
                              : item,
                          ),
                        },
                      }
                    : current,
                )
              }
              className={inputClass}
              placeholder="Buton linki: https://..."
            />
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={image.showButton ?? true}
                onChange={(event) =>
                  updateBlock(block.id, (current) =>
                    current.type === 'gallery'
                      ? {
                          ...current,
                          content: {
                            ...current.content,
                            images: current.content.images.map((item) =>
                              item.id === image.id ? { ...item, showButton: event.target.checked } : item,
                            ),
                          },
                        }
                      : current,
                  )
                }
                className="rounded border-gray-300"
              />
              Bu görselde buton göster
            </label>
          </div>
        ))}
      </div>
      <GalleryStyleControls block={block} />
    </>
  );
}

function GalleryStyleControls({ block }: { block: Extract<TemplateBlock, { type: 'gallery' }> }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  return (
    <>
      <Field label="Toplu görsel boyutu">
        <input
          type="range"
          min={30}
          max={100}
          value={Number.parseInt(block.style.imageWidth, 10) || 100}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'gallery' ? { ...current, style: { ...current.style, imageWidth: `${event.target.value}%` } } : current,
            )
          }
          className="w-full"
        />
        <span className="mt-1 block text-xs text-gray-500">{block.style.imageWidth}</span>
      </Field>
      <Field label="Görseller arası boşluk">
        <input
          value={block.style.gap}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'gallery' ? { ...current, style: { ...current.style, gap: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
      <Field label="Radius">
        <input
          value={block.style.borderRadius}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'gallery' ? { ...current, style: { ...current.style, borderRadius: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
      <Field label="Alt yazı rengi">
        <input
          type="color"
          value={block.style.captionColor}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'gallery' ? { ...current, style: { ...current.style, captionColor: event.target.value } } : current,
            )
          }
          className="h-10 w-full"
        />
      </Field>
      <Field label="Alt yazı boyutu">
        <input
          value={block.style.captionFontSize}
          onChange={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'gallery' ? { ...current, style: { ...current.style, captionFontSize: event.target.value } } : current,
            )
          }
          className={inputClass}
        />
      </Field>
      <AlignControl block={block} />
    </>
  );
}
