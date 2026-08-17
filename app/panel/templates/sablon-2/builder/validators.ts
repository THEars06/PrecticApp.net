import { TemplateDesign, TemplateMeta } from './types';

export function validateMeta(meta: TemplateMeta): string | null {
  if (!meta.name.trim()) return 'Şablon adı zorunludur.';
  if (meta.name.trim().length > 100) return 'Şablon adı en fazla 100 karakter olabilir.';
  if (meta.subject.trim().length > 255) return 'Mail konusu en fazla 255 karakter olabilir.';
  if (meta.description.trim().length > 255) return 'Açıklama en fazla 255 karakter olabilir.';
  return null;
}

export function validateDesign(design: TemplateDesign): string | null {
  if (design.source !== 'template2' || design.version !== 1) return 'Şablon 2 formatı geçersiz.';
  if (!design.blocks.length) return 'En az bir blok ekleyin.';
  if (design.blocks.length > 80) return 'Şablonda çok fazla blok var.';
  return null;
}

export function ensureUrlProtocol(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed === '{{UNSUBSCRIBE_URL}}') return trimmed;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) || trimmed.startsWith('/')) return trimmed;
  return `https://${trimmed}`;
}
