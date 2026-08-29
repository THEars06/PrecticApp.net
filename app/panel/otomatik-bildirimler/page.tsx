'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

type Binding = {
  id: string;
  eventKey: string;
  platform: string;
  mailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  mailTemplateId: string | null;
  smsTemplateId: string | null;
  mailProviderId: string | null;
  smsProviderId: string | null;
  subject: string | null;
  pushTitle: string | null;
  pushBody: string | null;
  pushApp: string;
  mailReasonText: string | null;
  smsReasonText: string | null;
  pushReasonText: string | null;
};

type Option = { id: string; name: string };

const EVENT_LABELS: Record<string, string> = {
  refund_success: 'İade Tamamlandı',
  event_cancelled: 'Etkinlik İptali',
};

export default function OtomatikBildirimlerPage() {
  const [bindings, setBindings] = useState<Binding[]>([]);
  const [mailTemplates, setMailTemplates] = useState<Option[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<Option[]>([]);
  const [mailProviders, setMailProviders] = useState<Option[]>([]);
  const [smsProviders, setSmsProviders] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const authHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const load = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const [bRes, mtRes, stRes, mpRes, spRes] = await Promise.all([
        fetch(`${API_URL}/transactional/bindings`, { headers }),
        fetch(`${API_URL}/templates`, { headers }),
        fetch(`${API_URL}/sms/templates`, { headers }),
        fetch(`${API_URL}/mail/providers`, { headers }),
        fetch(`${API_URL}/sms/providers`, { headers }),
      ]);
      if (bRes.ok) setBindings(await bRes.json());
      if (mtRes.ok) {
        const data = await mtRes.json();
        setMailTemplates(
          (Array.isArray(data) ? data : data?.data || []).map(
            (t: { id: string; name: string }) => ({
              id: t.id,
              name: t.name,
            }),
          ),
        );
      }
      if (stRes.ok) {
        const data = await stRes.json();
        setSmsTemplates(
          (Array.isArray(data) ? data : data?.data || []).map(
            (t: { id: string; name: string }) => ({
              id: t.id,
              name: t.name,
            }),
          ),
        );
      }
      if (mpRes.ok) {
        const data = await mpRes.json();
        setMailProviders(
          (Array.isArray(data) ? data : data?.data || []).map(
            (t: { id: string; name: string }) => ({
              id: t.id,
              name: t.name,
            }),
          ),
        );
      }
      if (spRes.ok) {
        const data = await spRes.json();
        setSmsProviders(
          (Array.isArray(data) ? data : data?.data || []).map(
            (t: { id: string; name: string }) => ({
              id: t.id,
              name: t.name,
            }),
          ),
        );
      }
    } catch (e) {
      console.error(e);
      setMessage('Yükleme hatası');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLocal = (eventKey: string, patch: Partial<Binding>) => {
    setBindings((prev) =>
      prev.map((b) => (b.eventKey === eventKey ? { ...b, ...patch } : b)),
    );
  };

  const save = async (b: Binding) => {
    setSavingKey(b.eventKey);
    setMessage(null);
    try {
      const res = await fetch(
        `${API_URL}/transactional/bindings/${b.eventKey}?platform=${b.platform}`,
        {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            mailEnabled: b.mailEnabled,
            smsEnabled: b.smsEnabled,
            pushEnabled: b.pushEnabled,
            mailTemplateId: b.mailTemplateId,
            smsTemplateId: b.smsTemplateId,
            mailProviderId: b.mailProviderId,
            smsProviderId: b.smsProviderId,
            subject: b.subject,
            pushTitle: b.pushTitle,
            pushBody: b.pushBody,
            pushApp: b.pushApp || 'legacy',
            mailReasonText: b.mailReasonText,
            smsReasonText: b.smsReasonText,
            pushReasonText: b.pushReasonText,
          }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      updateLocal(b.eventKey, updated);
      setMessage(`${EVENT_LABELS[b.eventKey] || b.eventKey} kaydedildi`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Kayıt hatası');
    } finally {
      setSavingKey(null);
    }
  };

  const sendTest = async (eventKey: string) => {
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/transactional/test`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          eventKey,
          platform: 'gise',
          email: testEmail || undefined,
          phone: testPhone || undefined,
          fullName: 'Test Kullanici',
          refundReason: 'Test iptal / iade sebebi',
          refundReasonMail: 'Test mail sebebi',
          refundReasonSms: 'Test SMS',
          refundReasonPush: 'Test push',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Test basarisiz');
      setMessage(
        `Test gonderildi — mail: ${data.mailStatus}, sms: ${data.smsStatus}`,
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Test hatasi');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Otomatik bildirimler yükleniyor…</div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Otomatik Bildirimler
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gişe iade ve etkinlik iptali tetikleyicileri için mail / SMS / push
          şablonlarını buradan yönetin.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">
          {message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-gray-600">
          Test e-posta
          <input
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="ornek@mail.com"
          />
        </label>
        <label className="text-sm text-gray-600">
          Test telefon
          <input
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="90555..."
          />
        </label>
      </div>

      {bindings.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Henüz binding yok. PES/pus içinde{' '}
          <code>npm run prisma:seed:marketing</code> çalıştırın.
        </div>
      )}

      {bindings.map((b) => (
        <div
          key={`${b.platform}-${b.eventKey}`}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {EVENT_LABELS[b.eventKey] || b.eventKey}
              </h2>
              <p className="text-xs text-gray-400">
                {b.eventKey} · {b.platform}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => sendTest(b.eventKey)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Test gönder
              </button>
              <button
                type="button"
                onClick={() => save(b)}
                disabled={savingKey === b.eventKey}
                className="rounded-lg bg-[#2b2973] px-3 py-1.5 text-sm text-white hover:bg-[#23215f] disabled:opacity-50"
              >
                {savingKey === b.eventKey ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {(
              [
                ['mailEnabled', 'Mail'],
                ['smsEnabled', 'SMS'],
                ['pushEnabled', 'Push'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(b[key])}
                  onChange={(e) =>
                    updateLocal(b.eventKey, { [key]: e.target.checked })
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-600">
              Mail şablonu
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.mailTemplateId || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    mailTemplateId: e.target.value || null,
                  })
                }
              >
                <option value="">Seçin</option>
                {mailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              SMS şablonu
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.smsTemplateId || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    smsTemplateId: e.target.value || null,
                  })
                }
              >
                <option value="">Seçin</option>
                {smsTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              Mail provider
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.mailProviderId || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    mailProviderId: e.target.value || null,
                  })
                }
              >
                <option value="">Seçin</option>
                {mailProviders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              SMS provider
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.smsProviderId || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    smsProviderId: e.target.value || null,
                  })
                }
              >
                <option value="">Seçin</option>
                {smsProviders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm text-gray-600">
            Mail konusu
            <input
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
              value={b.subject || ''}
              onChange={(e) =>
                updateLocal(b.eventKey, { subject: e.target.value })
              }
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-gray-600">
              Push başlık
              <input
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                maxLength={120}
                value={b.pushTitle || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, { pushTitle: e.target.value })
                }
              />
              <span className="text-xs text-gray-400">
                {(b.pushTitle || '').length}/120
              </span>
            </label>
            <label className="text-sm text-gray-600">
              Push hedef uygulama
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.pushApp || 'legacy'}
                onChange={(e) =>
                  updateLocal(b.eventKey, { pushApp: e.target.value })
                }
              >
                <option value="legacy">Eski mobil (yayında)</option>
                <option value="new">Yeni mobil</option>
                <option value="all">İkisi</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-gray-600">
            Push metin
            <textarea
              className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
              rows={3}
              maxLength={400}
              value={b.pushBody || ''}
              onChange={(e) =>
                updateLocal(b.eventKey, { pushBody: e.target.value })
              }
            />
            <span className="text-xs text-gray-400">
              {(b.pushBody || '').length}/400 — {'{{eventName}} {{amount}} {{currency}}'} desteklenir
            </span>
          </label>

          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">
              İade / iptal sebebi (Gişe panelden gelir)
            </p>
            <p className="text-xs text-gray-500">
              Sebep girildiyse kanal bazlı metin eklenir. Boş bırakırsanız sebep satırı gitmez. {'{{refundReason}}'} kullanın.
            </p>
            <label className="block text-sm text-gray-600">
              Mail sebep satırı
              <input
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.mailReasonText || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    mailReasonText: e.target.value || null,
                  })
                }
                placeholder="İptal sebebi: {{refundReason}}"
              />
            </label>
            <label className="block text-sm text-gray-600">
              SMS sebep satırı
              <input
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={b.smsReasonText || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    smsReasonText: e.target.value || null,
                  })
                }
                placeholder="Sebep: {{refundReason}}."
              />
            </label>
            <label className="block text-sm text-gray-600">
              Push sebep satırı
              <input
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                maxLength={200}
                value={b.pushReasonText || ''}
                onChange={(e) =>
                  updateLocal(b.eventKey, {
                    pushReasonText: e.target.value || null,
                  })
                }
                placeholder="Sebep: {{refundReason}}."
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
