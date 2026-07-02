'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Builder from '../builder/Builder';
import { fetchTemplate } from '../builder/api';
import { useTemplate2Store } from '../builder/store';
import { MailTemplate, TemplateDesign } from '../builder/types';

function isTemplate2Design(value: unknown): value is TemplateDesign {
  return Boolean(
    value &&
      typeof value === 'object' &&
      (value as TemplateDesign).version === 1 &&
      (value as TemplateDesign).source === 'template2' &&
      Array.isArray((value as TemplateDesign).blocks),
  );
}

export default function EditTemplate2Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const loadDesign = useTemplate2Store((state) => state.loadDesign);
  const [template, setTemplate] = useState<MailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchTemplate(id);
        if (!isTemplate2Design(data.designJson)) {
          setError('Bu şablon Şablon 2 formatında değil. Eski editörle açın.');
          return;
        }
        loadDesign(data.designJson, {
          name: data.name,
          subject: data.subject || '',
          description: data.description || '',
        });
        setTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Şablon yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id, loadDesign, router]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ae256c] border-t-transparent" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Şablon 2 açılamadı</h1>
        <p className="mt-2 text-sm text-red-500">{error}</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/panel/templates" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Listeye Dön
          </Link>
          <Link href={`/panel/templates/${id}`} className="rounded-xl bg-[#ae256c] px-4 py-2 text-sm font-semibold text-white">
            Eski Editörde Aç
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          <p className="text-sm text-gray-500">Şablon 2 düzenleme</p>
        </div>
        <Link href="/panel/templates" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
          Listeye Dön
        </Link>
      </div>
      <Builder templateId={id} draftKey={`template2:${id}`} />
    </div>
  );
}
