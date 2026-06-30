'use client';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BlockPalette from './BlockPalette';
import Canvas from './Canvas';
import DeviceFrame from './DeviceFrame';
import Inspector from './Inspector';
import { saveTemplate2, previewTemplate2 } from './api';
import { useTemplate2Store } from './store';
import { BlockType } from './types';
import { validateDesign, validateMeta } from './validators';
import { MOBILE_PREVIEW_WIDTH } from './DeviceFrame';

type Props = {
  templateId?: string;
  draftKey: string;
};

const isBlockType = (value: string): value is BlockType =>
  ['heading', 'text', 'image', 'gallery', 'hero', 'button', 'coupon', 'product', 'social', 'footer', 'divider', 'spacer', 'columns'].includes(value);

export default function Builder({ templateId, draftKey }: Props) {
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const meta = useTemplate2Store((state) => state.meta);
  const design = useTemplate2Store((state) => state.design);
  const addBlock = useTemplate2Store((state) => state.addBlock);
  const moveBlock = useTemplate2Store((state) => state.moveBlock);
  const undo = useTemplate2Store((state) => state.undo);
  const redo = useTemplate2Store((state) => state.redo);
  const device = useTemplate2Store((state) => state.deviceMode);
  const setDevice = useTemplate2Store((state) => state.setDeviceMode);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setDirty(true);
    localStorage.setItem(draftKey, JSON.stringify({ meta, design }));
  }, [meta, design, draftKey]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) return;

    if (activeId.startsWith('palette:')) {
      const type = activeId.replace('palette:', '');
      if (!isBlockType(type)) return;
      const index = design.blocks.findIndex((block) => block.id === overId);
      addBlock(type, index >= 0 ? index : undefined);
      return;
    }

    if (overId !== 'canvas') moveBlock(activeId, overId);
  };

  const handleSave = async () => {
    setError('');
    const metaError = validateMeta(meta);
    const designError = validateDesign(design);
    if (metaError || designError) {
      setError(metaError || designError || '');
      return;
    }

    setSaving(true);
    try {
      await saveTemplate2({ id: templateId, meta, design });
      localStorage.removeItem(draftKey);
      setDirty(false);
      router.push('/panel/templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şablon kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setError('');
    setPreviewing(true);
    try {
      setPreviewHtml(await previewTemplate2(design, device));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Önizleme oluşturulamadı.');
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div>
          <div className="text-sm font-bold text-gray-900">{meta.name || 'Şablon 2'}</div>
          <div className="text-xs text-gray-500">{meta.subject || 'Konu girilmedi'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={undo} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
            Geri Al
          </button>
          <button type="button" onClick={redo} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
            İleri Al
          </button>
          <button
            type="button"
            onClick={() => setDevice(device === 'desktop' ? 'mobile' : 'desktop')}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            {device === 'desktop' ? 'Mobile' : 'Desktop'}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewing}
            className="rounded-lg border border-[#2b2973] px-3 py-2 text-xs font-semibold text-[#2b2973] hover:bg-purple-50 disabled:opacity-50"
          >
            {previewing ? 'Hazırlanıyor' : 'Email Önizleme'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#2b2973] px-4 py-2 text-xs font-bold text-white hover:bg-[#1f1d5c] disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor' : 'Kaydet'}
          </button>
        </div>
      </div>

      {error ? <div className="shrink-0 border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div> : null}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid min-h-0 flex-1 overflow-hidden grid-cols-[260px_minmax(0,1fr)_320px]">
          <BlockPalette />
          <DeviceFrame device={device}>
            <Canvas />
          </DeviceFrame>
          <Inspector />
        </div>
      </DndContext>

      {previewHtml ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="flex h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{ width: device === 'mobile' ? MOBILE_PREVIEW_WIDTH + 32 : '100%', maxWidth: device === 'mobile' ? MOBILE_PREVIEW_WIDTH + 32 : '64rem' }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Gerçek Email Önizleme</h3>
                <p className="text-xs text-gray-500">
                  {device === 'mobile' ? 'Mobil görünüm (375px)' : 'Masaüstü görünüm'}
                </p>
              </div>
              <button type="button" onClick={() => setPreviewHtml(null)} className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">
                Kapat
              </button>
            </div>
            <div className={`flex-1 overflow-hidden ${device === 'mobile' ? 'bg-slate-200 p-3' : ''}`}>
              <iframe
                title="Email Önizleme"
                srcDoc={previewHtml}
                className="h-full w-full border-0 bg-white"
                style={device === 'mobile' ? { borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' } : undefined}
                sandbox="allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
