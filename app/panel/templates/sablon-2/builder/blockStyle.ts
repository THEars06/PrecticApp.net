import { TemplateBlock } from './types';

const DEFAULT_BLOCK_PADDING: Partial<Record<TemplateBlock['type'], string>> = {
  heading: '16px 24px',
  text: '12px 24px',
  image: '12px 24px',
  gallery: '12px 24px',
  hero: '40px 28px',
  coupon: '22px 24px',
  footer: '28px 24px',
  product: '22px 24px',
  social: '24px 24px',
  divider: '18px 24px',
  columns: '12px 24px',
  button: '16px 24px',
};

export function defaultBlockPadding(block: TemplateBlock): string | undefined {
  return DEFAULT_BLOCK_PADDING[block.type as keyof typeof DEFAULT_BLOCK_PADDING];
}

export function getBlockBackground(block: TemplateBlock): string {
  switch (block.type) {
    case 'hero':
      return block.style.bgColor || '';
    case 'product':
    case 'coupon':
    case 'footer':
    case 'social':
      return block.style.bg || '';
    case 'button':
      return block.style.blockBg || '';
    case 'heading':
    case 'text':
    case 'image':
    case 'gallery':
    case 'divider':
    case 'columns':
      return block.style.blockBg || '';
    default:
      return '';
  }
}

export function setBlockBackground(block: TemplateBlock, color: string): TemplateBlock {
  switch (block.type) {
    case 'hero':
      return { ...block, style: { ...block.style, bgColor: color } };
    case 'product':
      return { ...block, style: { ...block.style, bg: color } };
    case 'coupon':
      return { ...block, style: { ...block.style, bg: color } };
    case 'footer':
      return { ...block, style: { ...block.style, bg: color } };
    case 'social':
      return { ...block, style: { ...block.style, bg: color } };
    case 'button':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'heading':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'text':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'image':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'gallery':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'divider':
      return { ...block, style: { ...block.style, blockBg: color } };
    case 'columns':
      return { ...block, style: { ...block.style, blockBg: color } };
    default:
      return block;
  }
}

export function getBlockPadding(block: TemplateBlock): string | undefined {
  if (block.type === 'spacer') return undefined;
  if (block.type === 'button') {
    const value = block.style.blockPadding;
    if (value?.trim()) return value;
    return defaultBlockPadding(block);
  }
  const value = 'padding' in block.style ? (block.style.padding as string | undefined) : undefined;
  if (value?.trim()) return value;
  return defaultBlockPadding(block);
}

export function setBlockPadding(block: TemplateBlock, padding: string): TemplateBlock {
  if (block.type === 'spacer') return block;
  if (block.type === 'button') {
    return { ...block, style: { ...block.style, blockPadding: padding } };
  }
  return { ...block, style: { ...block.style, padding } } as TemplateBlock;
}

export function galleryCaptionsEnabled(block: Extract<TemplateBlock, { type: 'gallery' }>): boolean {
  if (block.content.captionsEnabled) return true;
  const visible = block.content.images.slice(0, block.style.columns);
  return visible.some((image) => Boolean(image.caption?.trim()));
}
