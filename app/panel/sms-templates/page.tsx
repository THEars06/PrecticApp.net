'use client';

import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const SMS_MAX_CHARS = 480;

const PLACEHOLDERS = [
  { key: '{{fullName}}', label: 'Ad Soyad' },
  { key: '{{firstName}}', label: 'Ad' },
  { key: '{{email}}', label: 'E-posta' },
  { key: '{{phoneNumber}}', label: 'Telefon' },
  { key: '{{eventName}}', label: 'Etkinlik' },
  { key: '{{eventDate}}', label: 'Tarih' },
  { key: '{{eventVenue}}', label: 'Mekan' },
  { key: '{{pnr}}', label: 'PNR' },
  { key: '{{amount}}', label: 'Tutar' },
  { key: '{{currency}}', label: 'Para birimi' },
] as const;

type SmsTemplate = {
  id: string;
  name: string;
  description: string | null;
  textContent: string;
  isActive: boolean;
  createdAt: string;
};

function personalizePreview(text: string) {
  return text
    .replace(/\{\{\s*fullName\s*\}\}/gi, 'Ahmet Yılmaz')
    .replace(/\{\{\s*firstName\s*\}\}/gi, 'Ahmet')
    .replace(/\{\{\s*email\s*\}\}/gi, 'ahmet@mail.com')
    .replace(/\{\{\s*phoneNumber\s*\}\}/gi, '905551234567');
}

export default function SmsTemplatesPage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SmsTemplate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/sms/templates/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTemplates(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setTextContent('');
    setModalOpen(true);
  };

  const openEdit = (t: SmsTemplate) => {
    setEditing(t);
    setName(t.name);
    setDescription(t.description || '');
    setTextContent(t.textContent);
    setModalOpen(true);
  };

  const insertPlaceholder = (token: string) => {
    const el = textareaRef.current;
    if (!el) {
      setTextContent((prev) => prev + token);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next =
      textContent.slice(0, start) + token + textContent.slice(end);
    if (next.length > SMS_MAX_CHARS) return;
    setTextContent(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSave = async () => {
    if (!name.trim() || !textContent.trim()) return;
    if (textContent.length > SMS_MAX_CHARS) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const body = {
        name: name.trim(),
        description: description.trim() || undefined,
        textContent,
      };
      const url = editing
        ? `${API_URL}/sms/templates/${editing.id}`
        : `${API_URL}/sms/templates`;
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchTemplates();
      } else {
        const err = await res.json();
        alert(err.message || 'Kayıt başarısız');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/sms/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteId(null);
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const previewLen = personalizePreview(textContent).length;

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold !text-black" style={{ color: '#000' }}>SMS Şablonları</h1>
          <p className="text-sm text-gray-600 mt-1">
            Düz metin şablonları — {'{{fullName}}'}, {'{{email}}'} vb.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[#2b2973] text-white"
        >
          Yeni Şablon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-black">
        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Yükleniyor...</div>
        ) : templates.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            Henüz şablon yok
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {templates.map((t) => (
              <div
                key={t.id}
                className="p-4 flex flex-col sm:flex-row sm:items-start gap-3 justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold !text-black" style={{ color: '#000' }}>{t.name}</p>
                    {!t.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Pasif
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>
                  )}
                  <p className="text-sm mt-2 whitespace-pre-wrap !text-black" style={{ color: '#000' }}>
                    {t.textContent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.textContent.length}/{SMS_MAX_CHARS}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 !text-black"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(t.id)}
                    className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-black">
            <h2 className="text-lg font-bold text-black">
              {editing ? 'Şablon Düzenle' : 'Yeni SMS Şablonu'}
            </h2>
            <div>
              <label className="text-xs text-gray-600">İsim</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Açıklama</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                style={{ color: '#000' }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Metin</label>
              <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                {PLACEHOLDERS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => insertPlaceholder(p.key)}
                    className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-[#2b2973] border border-indigo-100"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={textContent}
                onChange={(e) => {
                  if (e.target.value.length <= SMS_MAX_CHARS) {
                    setTextContent(e.target.value);
                  }
                }}
                rows={5}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono bg-white"
                style={{ color: '#000' }}
              />
              <div className="flex justify-between text-xs mt-1">
                <span
                  className={
                    textContent.length > SMS_MAX_CHARS
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }
                >
                  Ham: {textContent.length}/{SMS_MAX_CHARS}
                </span>
                <span
                  className={
                    previewLen > SMS_MAX_CHARS ? 'text-red-600' : 'text-gray-500'
                  }
                >
                  Örnek render: {previewLen}/{SMS_MAX_CHARS}
                </span>
              </div>
            </div>
            {textContent && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Önizleme</p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: '#000' }}>
                  {personalizePreview(textContent)}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 text-sm border rounded-lg text-black"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={saving || !name.trim() || !textContent.trim()}
                onClick={handleSave}
                className="px-3 py-2 text-sm rounded-lg bg-[#2b2973] text-white disabled:opacity-40"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4">
            <p className="font-medium text-gray-900">Şablon silinsin mi?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3 py-2 text-sm border rounded-lg"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
