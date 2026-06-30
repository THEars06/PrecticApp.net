import { GalleryColumns } from './types';

export const MOBILE_CANVAS_WIDTH = 375;

export type MobileGalleryColumns = 1 | 2 | 3;

export function defaultMobileColumns(columns: GalleryColumns): MobileGalleryColumns {
  if (columns === 2) return 2;
  return 2;
}

export function resolveMobileColumns(columns: GalleryColumns, mobileColumns?: MobileGalleryColumns): MobileGalleryColumns {
  if (mobileColumns && mobileColumns >= 1 && mobileColumns <= 3) {
    return Math.min(mobileColumns, columns) as MobileGalleryColumns;
  }
  return defaultMobileColumns(columns);
}

export function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}
