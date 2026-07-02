export type ParsedPadding = { top: number; right: number; bottom: number; left: number };

function parsePx(part: string, fallback: number): number {
  const match = part.trim().match(/^(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : fallback;
}

export function parsePadding(value: string | undefined, fallback = '12px 24px'): ParsedPadding {
  const parts = (value || fallback).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const all = parsePx(parts[0], 12);
    return { top: all, right: all, bottom: all, left: all };
  }
  if (parts.length === 2) {
    const vertical = parsePx(parts[0], 12);
    const horizontal = parsePx(parts[1], 24);
    return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
  }
  if (parts.length === 3) {
    return {
      top: parsePx(parts[0], 12),
      right: parsePx(parts[1], 24),
      bottom: parsePx(parts[2], 12),
      left: parsePx(parts[1], 24),
    };
  }
  return {
    top: parsePx(parts[0], 12),
    right: parsePx(parts[1], 24),
    bottom: parsePx(parts[2], 12),
    left: parsePx(parts[3], 24),
  };
}

export function formatPadding(padding: ParsedPadding): string {
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}

export function updatePaddingVertical(value: string | undefined, top: number, bottom: number, fallback = '12px 24px'): string {
  const current = parsePadding(value, fallback);
  return formatPadding({ ...current, top, bottom });
}

export function parseButtonPadding(value: string | undefined): { vertical: number; horizontal: number } {
  const parts = (value || '8px 12px').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const v = parsePx(parts[0], 8);
    return { vertical: v, horizontal: v };
  }
  return { vertical: parsePx(parts[0], 8), horizontal: parsePx(parts[1], 12) };
}

export function formatButtonPadding(vertical: number, horizontal: number): string {
  return `${vertical}px ${horizontal}px`;
}

export function aspectToCssRatio(aspect?: number): string | undefined {
  if (!aspect) return undefined;
  if (aspect === 1) return '1 / 1';
  if (Math.abs(aspect - 4 / 3) < 0.01) return '4 / 3';
  if (Math.abs(aspect - 16 / 9) < 0.01) return '16 / 9';
  if (Math.abs(aspect - 3 / 2) < 0.01) return '3 / 2';
  if (Math.abs(aspect - 2 / 3) < 0.01) return '2 / 3';
  return `${aspect} / 1`;
}
