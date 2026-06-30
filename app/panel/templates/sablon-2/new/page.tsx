'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Builder from '../builder/Builder';
import { defaultSettings, presetOptions } from '../builder/presets';
import { useTemplate2Store } from '../builder/store';
import { PresetId, TemplateMeta, TemplateSettings } from '../builder/types';
import { uploadImage } from '../builder/uploadImage';
import { validateMeta } from '../builder/validators';

const draftKey = 'template2:new';
const colorTextClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2b2973]';

function colorPickerValue(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function AppearanceColorInput({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex gap-2">
        <input
          type="color"
          value={colorPickerValue(value, fallback)}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-16 shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
        />
        <input value={value} onChange={(event) => onChange(event.target.value)} className={colorTextClass} placeholder={fallback} />
      </div>
    </label>
  );
}

export default function NewTemplate2Page() {
  const resetFromPreset = useTemplate2Store((state) => state.resetFromPreset);
  const [step, setStep] = useState<'wizard' | 'editor'>('wizard');
  const [meta, setMeta] = useState<TemplateMeta>({ name: '', subject: '', description: '' });
  const [settings, setSettings] = useState<TemplateSettings>(defaultSettings);
  const [preset, setPreset] = useState<PresetId>('blank');
  const [error, setError] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    // Her açılışta temiz başla: eski taslağı temizle ve store'u sıfırla.
    localStorage.removeItem(draftKey);
    resetFromPreset('blank', defaultSettings, { name: '', subject: '', description: '' });
    setStep('wizard');
    setMeta({ name: '', subject: '', description: '' });
    setSettings(defaultSettings);
    setPreset('blank');
  }, [resetFromPreset]);

  const handleStart = () => {
    const validation = validateMeta(meta);
    if (validation) {
      setError(validation);
      return;
    }
    resetFromPreset(preset, settings, meta);
    setStep('editor');
  };

  const handleBackgroundUpload = async (file: File) => {
    setUploadingBg(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setSettings((current) => ({ ...current, bgImage: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arka plan görseli yüklenemedi.');
    } finally {
      setUploadingBg(false);
    }
  };

  if (step === 'editor') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Şablon 2 Tasarım</h1>
            <p className="text-sm text-gray-500">JSON tabanlı sürükle-bırak email builder</p>
          </div>
          <button
            type="button"
            onClick={() => setStep('wizard')}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Kuruluma Dön
          </button>
        </div>
        <Builder draftKey={draftKey} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/panel/templates" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şablon 2 Oluştur</h1>
          <p className="text-sm text-gray-500">Önce temel bilgileri gir, sonra tasarıma geç.</p>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Mail Bilgileri</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Şablon Adı *</span>
              <input
                value={meta.name}
                onChange={(event) => setMeta((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-[#2b2973]"
                placeholder="Örn: Mayıs Kampanyası"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Mail Konusu</span>
              <input
                value={meta.subject}
                onChange={(event) => setMeta((current) => ({ ...current, subject: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-[#2b2973]"
                placeholder="Örn: Sana özel fırsatlar"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Açıklama</span>
              <textarea
                value={meta.description}
                onChange={(event) => setMeta((current) => ({ ...current, description: event.target.value }))}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-[#2b2973]"
                placeholder="Bu şablon ne için kullanılacak?"
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Görünüm</h2>
            <div className="mt-4 space-y-4">
              <AppearanceColorInput
                label="Dış arka plan rengi"
                value={settings.bgColor}
                fallback="#f3f4f6"
                onChange={(value) => setSettings((current) => ({ ...current, bgColor: value }))}
              />
              <AppearanceColorInput
                label="İçerik arka plan rengi"
                value={settings.contentBgColor}
                fallback="#ffffff"
                onChange={(value) => setSettings((current) => ({ ...current, contentBgColor: value }))}
              />
              <label className="block rounded-xl border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 hover:border-[#2b2973]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleBackgroundUpload(file);
                    event.currentTarget.value = '';
                  }}
                />
                {uploadingBg ? 'Yükleniyor...' : settings.bgImage ? 'Arka plan görseli yüklendi' : 'Opsiyonel arka plan görseli yükle'}
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Başlangıç Şablonu</h2>
            <div className="mt-4 space-y-2">
              {presetOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreset(item.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    preset === item.id ? 'border-[#2b2973] bg-purple-50' : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="text-sm font-bold text-gray-900">{item.name}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.description}</div>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleStart}
          className="rounded-xl bg-[#2b2973] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-[#1f1d5c]"
        >
          Tasarıma Geç
        </button>
      </div>
    </div>
  );
}
