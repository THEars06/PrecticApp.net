const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const UPLOAD_BASE = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || API_URL;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function toCdnUrl(rawUrl: string): string {
  let pathname = rawUrl;
  if (rawUrl.startsWith('http')) {
    try {
      pathname = new URL(rawUrl).pathname;
    } catch {
      return rawUrl;
    }
  }
  return `${UPLOAD_BASE}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}

export async function uploadImage(file: File | Blob, filename?: string): Promise<string> {
  if (file instanceof File && !file.type.startsWith('image/')) {
    throw new Error('Sadece görsel dosyaları yüklenebilir.');
  }

  if (file instanceof File && file.size > MAX_IMAGE_SIZE) {
    throw new Error('Görsel en fazla 10MB olabilir.');
  }

  const formData = new FormData();
  const name = filename || (file instanceof File ? file.name : 'image.jpg');
  formData.append('file', file, name);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Görsel yüklenemedi.');
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) throw new Error('Upload yanıtında URL yok.');
  return toCdnUrl(payload.url);
}
