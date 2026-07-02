import { GalleryImage } from './types';

/** Buton linki doluysa onu kullan; boşsa görsel linkine düş. */
export function resolveGalleryButtonUrl(
  image: Pick<GalleryImage, 'buttonUrl' | 'link'>,
  legacyButtonUrl?: string,
): string {
  const buttonUrl = image.buttonUrl?.trim();
  if (buttonUrl) return buttonUrl;

  const imageLink = image.link?.trim();
  if (imageLink) return imageLink;

  const legacy = legacyButtonUrl?.trim();
  if (legacy) return legacy;

  return '#';
}
