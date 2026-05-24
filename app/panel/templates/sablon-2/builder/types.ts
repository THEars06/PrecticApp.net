export type TextAlign = 'left' | 'center' | 'right';
export type LinkTarget = '_blank' | '_self';
export type DeviceMode = 'desktop' | 'mobile';
export type PresetId = 'blank' | 'newsletter' | 'campaign' | 'welcome' | 'discount' | 'announcement';
export type GalleryColumns = 2 | 3 | 4 | 5;

export type TemplateMeta = {
  name: string;
  subject: string;
  description: string;
};

export type TemplateSettings = {
  bgColor: string;
  bgImage?: string;
  contentBgColor: string;
  contentWidth: number;
  fontFamily: string;
};

export type BaseBlock = {
  id: string;
  type: string;
};

export type HeadingBlock = BaseBlock & {
  type: 'heading';
  content: { text: string; level: 1 | 2 | 3 };
  style: { color: string; align: TextAlign; fontSize: string };
};

export type TextBlock = BaseBlock & {
  type: 'text';
  content: { html: string };
  style: { color: string; fontSize: string; lineHeight: string; align: TextAlign };
};

export type ImageBlock = BaseBlock & {
  type: 'image';
  content: { src: string; alt: string; caption?: string; link?: string; linkTarget?: LinkTarget };
  style: { width: string; align: TextAlign; borderRadius: string; padding: string; captionColor: string; captionFontSize: string };
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width?: string;
  caption?: string;
  link?: string;
};

export type GalleryBlock = BaseBlock & {
  type: 'gallery';
  content: { images: GalleryImage[] };
  style: {
    columns: GalleryColumns;
    gap: string;
    imageWidth: string;
    align: TextAlign;
    borderRadius: string;
    padding: string;
    captionColor: string;
    captionFontSize: string;
  };
};

export type HeroBlock = BaseBlock & {
  type: 'hero';
  content: { image?: string; title: string; subtitle?: string; buttonText?: string; buttonUrl?: string };
  style: { bgColor: string; textColor: string; align: TextAlign; padding: string; borderRadius: string; imageWidth?: string };
};

export type ButtonBlock = BaseBlock & {
  type: 'button';
  content: { text: string; url: string; target: LinkTarget };
  style: { bg: string; color: string; borderRadius: string; padding: string; align: TextAlign; fontSize: string };
};

export type CouponBlock = BaseBlock & {
  type: 'coupon';
  content: { label: string; code: string; description?: string };
  style: {
    bg: string;
    borderColor: string;
    textColor: string;
    codeColor: string;
    align: TextAlign;
    padding: string;
    borderRadius: string;
    codeFontSize: string;
  };
};

export type FooterBlock = BaseBlock & {
  type: 'footer';
  content: { company: string; text: string; unsubscribeText: string; unsubscribeUrl: string };
  style: {
    bg: string;
    color: string;
    linkColor: string;
    align: TextAlign;
    padding: string;
    fontSize: string;
  };
};

export type ProductBlock = BaseBlock & {
  type: 'product';
  content: {
    image?: string;
    title: string;
    description?: string;
    price?: string;
    buttonText: string;
    buttonUrl: string;
  };
  style: {
    bg: string;
    titleColor: string;
    textColor: string;
    priceColor: string;
    buttonBg: string;
    buttonColor: string;
    align: TextAlign;
    padding: string;
    borderRadius: string;
    imageWidth?: string;
  };
};

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'website' | 'linkedin';

export type SocialLink = {
  id: string;
  platform?: SocialPlatform;
  label: string;
  url: string;
};

export type SocialBlock = BaseBlock & {
  type: 'social';
  content: { title: string; links: SocialLink[] };
  style: {
    bg: string;
    color: string;
    linkBg: string;
    linkColor: string;
    align: TextAlign;
    padding: string;
    borderRadius: string;
    fontSize: string;
  };
};

export type DividerBlock = BaseBlock & {
  type: 'divider';
  content: Record<string, never>;
  style: { color: string; thickness: string; padding: string };
};

export type SpacerBlock = BaseBlock & {
  type: 'spacer';
  content: Record<string, never>;
  style: { height: string };
};

export type ColumnsBlock = BaseBlock & {
  type: 'columns';
  content: { left: TemplateBlock[]; right: TemplateBlock[] };
  style: { gap: string; padding: string; stackOnMobile: boolean };
};

export type TemplateBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | GalleryBlock
  | HeroBlock
  | ButtonBlock
  | CouponBlock
  | FooterBlock
  | ProductBlock
  | SocialBlock
  | DividerBlock
  | SpacerBlock
  | ColumnsBlock;

export type BlockType = TemplateBlock['type'];

export type TemplateDesign = {
  version: 1;
  source: 'template2';
  settings: TemplateSettings;
  blocks: TemplateBlock[];
};

export type MailTemplate = {
  id: string;
  name: string;
  subject: string | null;
  description: string | null;
  htmlContent: string;
  cssContent: string | null;
  gjsData?: unknown;
  designJson?: TemplateDesign | null;
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
};
