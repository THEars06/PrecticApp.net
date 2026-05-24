const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Sadece görsel dosyaları yüklenebilir.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Görsel en fazla 10MB olabilir.');
  }

  const formData = new FormData();
  formData.append('file', file);
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
  return payload.url;
}
