import { nanoid } from 'nanoid';
import { BlockType, PresetId, TemplateBlock, TemplateDesign, TemplateSettings } from './types';

export const defaultSettings: TemplateSettings = {
  bgColor: '#f3f4f6',
  contentBgColor: '#ffffff',
  contentWidth: 600,
  fontFamily: 'Arial, Helvetica, sans-serif',
};

export const presetOptions: Array<{ id: PresetId; name: string; description: string }> = [
  { id: 'blank', name: 'Boş Şablon', description: 'Sıfırdan kendi akışını kur.' },
  { id: 'newsletter', name: 'Newsletter', description: 'Başlık, içerik ve CTA yapısı.' },
  { id: 'campaign', name: 'Kampanya', description: 'Hero, metin, buton ve görsel.' },
  { id: 'welcome', name: 'Hoş Geldin', description: 'Yeni kullanıcı karşılama maili.' },
  { id: 'discount', name: 'İndirim', description: 'Kupon ve satış odaklı düzen.' },
  { id: 'announcement', name: 'Duyuru', description: 'Net bilgi ve tek CTA.' },
];

const createGalleryImages = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `gallery-image-${nanoid(8)}`,
    src: '',
    alt: `Görsel ${index + 1}`,
    width: '100%',
    caption: `Açıklama ${index + 1}`,
  }));

export function createBlock(type: BlockType): TemplateBlock {
  const id = `${type}-${nanoid(8)}`;

  switch (type) {
    case 'heading':
      return {
        id,
        type,
        content: { text: 'Başlık yazın', level: 1 },
        style: { color: '#111827', align: 'center', fontSize: '32px' },
      };
    case 'text':
      return {
        id,
        type,
        content: { html: 'Metin içeriğinizi buraya yazın.' },
        style: { color: '#374151', fontSize: '16px', lineHeight: '1.6', align: 'center' },
      };
    case 'image':
      return {
        id,
        type,
        content: { src: '', alt: 'Görsel', caption: '', linkTarget: '_blank' },
        style: {
          width: '100%',
          align: 'center',
          borderRadius: '12px',
          padding: '12px 24px',
          captionColor: '#6b7280',
          captionFontSize: '13px',
        },
      };
    case 'gallery':
      return {
        id,
        type,
        content: {
          images: createGalleryImages(4),
        },
        style: {
          columns: 4,
          gap: '12px',
          imageWidth: '100%',
          align: 'center',
          borderRadius: '12px',
          padding: '12px 24px',
          captionColor: '#6b7280',
          captionFontSize: '13px',
        },
      };
    case 'hero':
      return {
        id,
        type,
        content: {
          title: 'Güçlü bir başlık yazın',
          subtitle: 'Kısa açıklama ile mesajınızı netleştirin.',
          buttonText: 'İncele',
          buttonUrl: 'https://example.com',
        },
        style: { bgColor: '#eef2ff', textColor: '#111827', align: 'center', padding: '40px 28px', borderRadius: '16px', imageWidth: '100%' },
      };
    case 'button':
      return {
        id,
        type,
        content: { text: 'Buton', url: 'https://example.com', target: '_blank' },
        style: { bg: '#2b2973', color: '#ffffff', borderRadius: '8px', padding: '14px 24px', align: 'center', fontSize: '16px' },
      };
    case 'coupon':
      return {
        id,
        type,
        content: { label: 'İndirim Kodu', code: 'KUPON20', description: 'Sepette kullanabileceğiniz özel kod.' },
        style: {
          bg: '#fff7ed',
          borderColor: '#fb923c',
          textColor: '#9a3412',
          codeColor: '#111827',
          align: 'center',
          padding: '22px 24px',
          borderRadius: '14px',
          codeFontSize: '28px',
        },
      };
    case 'footer':
      return {
        id,
        type,
        content: {
          company: 'PrecticApp',
          text: 'Bu e-posta bilgilendirme amacıyla gönderilmiştir.',
          unsubscribeText: 'Abonelikten çık',
          unsubscribeUrl: 'https://example.com/unsubscribe',
        },
        style: { bg: '#f9fafb', color: '#6b7280', linkColor: '#2b2973', align: 'center', padding: '28px 24px', fontSize: '13px' },
      };
    case 'product':
      return {
        id,
        type,
        content: {
          title: 'Ürün Başlığı',
          description: 'Ürün açıklamasını kısa ve net yazın.',
          price: '₺499',
          buttonText: 'Satın Al',
          buttonUrl: 'https://example.com/product',
        },
        style: {
          bg: '#ffffff',
          titleColor: '#111827',
          textColor: '#6b7280',
          priceColor: '#2b2973',
          buttonBg: '#2b2973',
          buttonColor: '#ffffff',
          align: 'center',
          padding: '22px 24px',
          borderRadius: '16px',
          imageWidth: '100%',
        },
      };
    case 'social':
      return {
        id,
        type,
        content: {
          title: 'Bizi takip edin',
          links: [
            { id: `social-${nanoid(8)}`, platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
            { id: `social-${nanoid(8)}`, platform: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
            { id: `social-${nanoid(8)}`, platform: 'x', label: 'X', url: 'https://x.com' },
          ],
        },
        style: {
          bg: '#f9fafb',
          color: '#374151',
          linkBg: '#ffffff',
          linkColor: '#2b2973',
          align: 'center',
          padding: '24px 24px',
          borderRadius: '16px',
          fontSize: '14px',
        },
      };
    case 'divider':
      return {
        id,
        type,
        content: {},
        style: { color: '#e5e7eb', thickness: '1px', padding: '18px 24px' },
      };
    case 'spacer':
      return {
        id,
        type,
        content: {},
        style: { height: '28px' },
      };
    case 'columns':
      return {
        id,
        type,
        content: {
          left: [createBlock('text')],
          right: [createBlock('text')],
        },
        style: { gap: '12px', padding: '12px 24px', stackOnMobile: true },
      };
  }
}

const withIds = (blocks: BlockType[]): TemplateBlock[] => blocks.map((type) => createBlock(type));

export function createDesignFromPreset(preset: PresetId, settings: TemplateSettings = defaultSettings): TemplateDesign {
  const presetBlocks: Record<PresetId, TemplateBlock[]> = {
    blank: [],
    newsletter: withIds(['heading', 'text', 'divider', 'gallery', 'text', 'button']),
    campaign: [createBlock('hero'), ...withIds(['text', 'button', 'divider', 'gallery', 'social'])],
    welcome: [createBlock('hero'), ...withIds(['text', 'button', 'spacer'])],
    discount: [createBlock('hero'), ...withIds(['heading', 'text', 'coupon', 'product', 'button', 'divider', 'footer'])],
    announcement: withIds(['heading', 'text', 'button', 'social', 'divider', 'footer']),
  };

  return {
    version: 1,
    source: 'template2',
    settings: { ...settings },
    blocks: presetBlocks[preset],
  };
}
