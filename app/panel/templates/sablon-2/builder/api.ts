import { MailTemplate, TemplateDesign, TemplateMeta } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

function authHeaders(json = true): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  let message = 'İşlem başarısız oldu.';
  try {
    const payload = await response.json();
    message = Array.isArray(payload.message) ? payload.message.join(', ') : payload.message || message;
  } catch {}
  throw new Error(message);
}

export async function fetchTemplate(id: string): Promise<MailTemplate> {
  const response = await fetch(`${API_URL}/templates/${id}`, {
    headers: authHeaders(false),
  });
  return parseOrThrow<MailTemplate>(response);
}

export async function saveTemplate2(input: {
  id?: string;
  meta: TemplateMeta;
  design: TemplateDesign;
}): Promise<MailTemplate> {
  const response = await fetch(`${API_URL}/templates${input.id ? `/${input.id}` : ''}`, {
    method: input.id ? 'PATCH' : 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: input.meta.name.trim(),
      subject: input.meta.subject.trim() || null,
      description: input.meta.description.trim() || null,
      designJson: input.design,
    }),
  });
  return parseOrThrow<MailTemplate>(response);
}

export async function previewTemplate2(design: TemplateDesign): Promise<string> {
  const response = await fetch(`${API_URL}/templates/preview`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ designJson: design }),
  });
  const payload = await parseOrThrow<{ html: string }>(response);
  return payload.html;
}
