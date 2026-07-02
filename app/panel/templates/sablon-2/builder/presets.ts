import { nanoid } from 'nanoid';
import { GISE_BRAND } from './brandColors';
import { BlockType, PresetId, TemplateBlock, TemplateDesign, TemplateSettings } from './types';

export const defaultSettings: TemplateSettings = {
  bgColor: GISE_BRAND.outerBg,
  contentBgColor: GISE_BRAND.contentBg,
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
    caption: '',
    showButton: true,
    buttonText: 'Satın Al',
    buttonTarget: '_blank' as const,
  }));

export function createBlock(type: BlockType): TemplateBlock {
  const id = `${type}-${nanoid(8)}`;

  switch (type) {
    case 'heading':
      return {
        id,
        type,
        content: { text: 'Başlık yazın', level: 1 },
        style: { color: GISE_BRAND.secondary, align: 'center', fontSize: '24px', padding: '16px 24px' },
      };
    case 'text':
      return {
        id,
        type,
        content: { html: 'Metin içeriğinizi buraya yazın.' },
        style: {
          color: GISE_BRAND.textBody,
          fontSize: '16px',
          lineHeight: '1.6',
          align: 'center',
          padding: '12px 24px',
        },
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
          captionColor: GISE_BRAND.textMuted,
          captionFontSize: '13px',
        },
      };
    case 'gallery':
      return {
        id,
        type,
        content: {
          images: createGalleryImages(4),
          showButtons: true,
          captionsEnabled: false,
        },
        style: {
          columns: 4,
          gap: '12px',
          imageWidth: '100%',
          align: 'center',
          borderRadius: '12px',
          padding: '12px 24px',
          captionColor: GISE_BRAND.textMuted,
          captionFontSize: '13px',
          buttonBg: GISE_BRAND.primary,
          buttonColor: GISE_BRAND.white,
          buttonRadius: '8px',
          buttonFontSize: '12px',
          buttonPadding: '8px 12px',
          buttonMarginTop: '8px',
          buttonMarginBottom: '0px',
          cropAspect: 1,
          imageAspectRatio: '1 / 1',
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
        style: {
          bgColor: GISE_BRAND.primaryLight,
          textColor: GISE_BRAND.secondary,
          buttonBg: GISE_BRAND.primary,
          buttonColor: GISE_BRAND.white,
          buttonFontSize: '15px',
          buttonPadding: '13px 22px',
          buttonMarginTop: '20px',
          buttonMarginBottom: '0px',
          align: 'center',
          padding: '40px 28px',
          borderRadius: '16px',
          imageWidth: '100%',
        },
      };
    case 'button':
      return {
        id,
        type,
        content: { text: 'Buton', url: 'https://example.com', target: '_blank' },
        style: {
          bg: GISE_BRAND.primary,
          color: GISE_BRAND.white,
          borderRadius: '8px',
          padding: '14px 24px',
          align: 'center',
          fontSize: '16px',
          blockPadding: '16px 24px',
        },
      };
    case 'coupon':
      return {
        id,
        type,
        content: { label: 'İndirim Kodu', code: 'KUPON20', description: 'Sepette kullanabileceğiniz özel kod.' },
        style: {
          bg: GISE_BRAND.primaryLight,
          borderColor: GISE_BRAND.primary,
          textColor: GISE_BRAND.secondary,
          codeColor: GISE_BRAND.primary,
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
          company: 'GiseKibris',
          text: 'Bu e-posta bilgilendirme amacıyla gönderilmiştir.',
          unsubscribeText: 'Abonelikten çık',
          unsubscribeUrl: '{{UNSUBSCRIBE_URL}}',
        },
        style: {
          bg: GISE_BRAND.outerBg,
          color: GISE_BRAND.textMuted,
          linkColor: GISE_BRAND.primary,
          align: 'center',
          padding: '28px 24px',
          fontSize: '13px',
        },
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
          bg: GISE_BRAND.white,
          titleColor: GISE_BRAND.secondary,
          textColor: GISE_BRAND.textMuted,
          priceColor: GISE_BRAND.primary,
          buttonBg: GISE_BRAND.primary,
          buttonColor: GISE_BRAND.white,
          buttonFontSize: '15px',
          buttonPadding: '13px 22px',
          buttonMarginTop: '16px',
          buttonMarginBottom: '0px',
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
          bg: GISE_BRAND.outerBg,
          color: GISE_BRAND.secondary,
          linkBg: GISE_BRAND.white,
          linkColor: GISE_BRAND.primary,
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
        style: { color: GISE_BRAND.border, thickness: '1px', padding: '18px 24px' },
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
        style: { gap: '12px', padding: '12px 24px', stackOnMobile: false },
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
