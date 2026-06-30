import { DeviceMode } from './types';

const FONT_SCALE = 0.82;
const PADDING_SCALE = 0.75;

function scalePx(value: string, factor: number, minPx: number): string {
  const match = /^(\d+(?:\.\d+)?)px$/.exec(value.trim());
  if (!match) return value;
  return `${Math.max(minPx, Math.round(Number(match[1]) * factor))}px`;
}

export function scalePadding(value: string, factor = PADDING_SCALE): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => scalePx(part, factor, 4))
    .join(' ');
}

export function mobileButtonFont(fontSize: string, device: DeviceMode): string {
  return device === 'mobile' ? scalePx(fontSize, FONT_SCALE, 10) : fontSize;
}

export function mobileButtonPadding(padding: string, device: DeviceMode): string {
  return device === 'mobile' ? scalePadding(padding) : padding;
}

export function mobileButtonMinHeight(height: string, device: DeviceMode): string {
  return device === 'mobile' ? scalePx(height, PADDING_SCALE, 28) : height;
}
