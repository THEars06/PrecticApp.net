'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const PAGE_SIZE = 20;

type SmsStats = {
  sent: number;
  failed: number;
  pending: number;
  sending: number;
};

type SmsReport = {
  id: string;
  label: string;
  recipientCount: number;
  status: string;
  platform: string | null;
  createdAt: string;
  provider: { name: string };
  template: { name: string } | null;
  stats: SmsStats;
};

type ReportsResponse = {
  data: SmsReport[];
  summary: SmsStats & { campaigns: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
};

type RecipientRow = {
  gsm: string;
  email: string | null;
  fullName: string | null;
  status: string;
  sentAt: string | null;
  failedAt: string | null;
  errorMsg: string | null;
  attempts: number;
};

type DetailResponse = {
  log: {
    id: string;
    label: string;
    recipientCount: number;
    status: string;
    platform: string | null;
    createdAt: string;
    template: { id: string; name: string } | null;
    provider: { id: string; name: string; type: string };
  };
  stats: SmsStats;
  unsentCount: number;
  data: RecipientRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

const STATUS_LABELS: Record<string, string> = {
  sent: 'Tamamlandı',
  scheduled: 'Zamanlandı',
  pending: 'Bekliyor',
  failed: 'Başarısız',
  partial: 'Kısmi',
  cancelled: 'İptal',
  sending: 'Gönderiliyor',
};

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  partial: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-gray-100 text-gray-600',
  sending: 'bg-blue-100 text-blue-700',
};

const PLATFORM_LABELS: Record<string, string> = {
  gise: 'Gişe Kıbrıs',
  kupon: 'Kupon Kıbrıs',
};

export default function SmsReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }
    >
      <SmsReportsContent />
    </Suspense>
  );
}

function SmsReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightId = searchParams.get('highlight');

  const [reports, setReports] = useState<SmsReport[]>([]);
  const [summary, setSummary] = useState<SmsStats & { campaigns: number }>({
    sent: 0,
    failed: 0,
    pending: 0,
    sending: 0,
    campaigns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellingAll, setCancellingAll] = useState(false);
  const [detailReport, setDetailReport] = useState<SmsReport | null>(null);
  const highlightRef = useRef<HTMLTableRowElement>(null);

  const fetchReports = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
      });
      const res = await fetch(`${API_URL}/sms/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: ReportsResponse = await res.json();
        setReports(data.data ?? []);
        setSummary(data.summary ?? { sent: 0, failed: 0, pending: 0, sending: 0, campaigns: 0 });
        setTotalPages(data.meta?.totalPages ?? 1);
        setTotal(data.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('SMS raporları yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(page);
  }, [page, fetchReports]);

  useEffect(() => {
    if (highlightId && highlightRef.current && !loading) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, loading, reports]);

  const canCancelCampaign = (report: SmsReport) =>
    ['pending', 'scheduled', 'partial'].includes(report.status) ||
    report.stats.pending > 0 ||
    report.stats.sending > 0;

  const handleCancelCampaign = async (logId: string) => {
    if (!confirm('Bu kampanyanın bekleyen SMS kuyruğunu iptal etmek istiyor musunuz?')) {
      return;
    }
    setCancellingId(logId);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/sms/queue/cancel-by-log/${logId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'İptal başarısız');
        return;
      }
      alert(`${data.cancelledCount ?? 0} bekleyen batch iptal edildi`);
      fetchReports(page, true);
    } catch (error) {
      console.error(error);
      alert('İptal sırasında hata oluştu');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelAll = async () => {
    if (
      !confirm(
        'TÜM bekleyen SMS kuyruklarını iptal etmek istediğine emin misin? Bu işlem geri alınamaz.',
      )
    ) {
      return;
    }
    setCancellingAll(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/sms/queue/cancel-all`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Toplu iptal başarısız');
        return;
      }
      alert(`${data.cancelledCount ?? 0} bekleyen batch iptal edildi`);
      fetchReports(page, true);
    } catch (error) {
      console.error(error);
      alert('Toplu iptal sırasında hata oluştu');
    } finally {
      setCancellingAll(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Raporları</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kampanya başına SMS gönderim durumunu takip edin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancelAll}
            disabled={cancellingAll || loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
          >
            {cancellingAll ? 'Durduruluyor...' : 'Tüm Kuyruğu Durdur'}
          </button>
          <button
            onClick={() => fetchReports(page, true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white disabled:opacity-60"
          >
            {refreshing ? 'Güncelleniyor...' : 'Verileri Güncelle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Toplam Kampanya', value: summary.campaigns, color: 'text-[#2b2973]' },
          { label: 'Gönderilen', value: summary.sent, color: 'text-green-600' },
          { label: 'Başarısız', value: summary.failed, color: 'text-red-600' },
          { label: 'Bekleyen', value: summary.pending, color: 'text-yellow-600' },
          { label: 'Gönderiliyor', value: summary.sending, color: 'text-blue-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value.toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Henüz SMS kampanyası bulunmuyor</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kampanya</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Platform</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Şablon</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tarih</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Hedef</th>
                  <th className="text-right px-4 py-3 font-medium text-green-600">Gönderilen</th>
                  <th className="text-right px-4 py-3 font-medium text-red-600">Başarısız</th>
                  <th className="text-right px-4 py-3 font-medium text-yellow-600">Bekleyen</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => {
                  const isHighlighted = highlightId === report.id;
                  return (
                    <tr
                      key={report.id}
                      ref={isHighlighted ? highlightRef : undefined}
                      className={
                        isHighlighted
                          ? 'bg-green-50 ring-2 ring-inset ring-green-300'
                          : 'hover:bg-gray-50'
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-[200px] truncate" title={report.label}>
                          {report.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{report.provider.name}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {report.platform ? PLATFORM_LABELS[report.platform] || report.platform : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{report.template?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {report.recipientCount.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        {report.stats.sent.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">
                        {report.stats.failed.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-yellow-600">
                        {(report.stats.pending + report.stats.sending).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[report.status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {STATUS_LABELS[report.status] || report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailReport(report)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-[#2b2973] hover:bg-indigo-100"
                          >
                            Tamamı
                          </button>
                          {canCancelCampaign(report) && (
                            <button
                              type="button"
                              onClick={() => handleCancelCampaign(report.id)}
                              disabled={cancellingId === report.id}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                              {cancellingId === report.id ? '...' : 'Durdur'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Toplam {total.toLocaleString('tr-TR')} kampanya
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {detailReport && (
        <CampaignDetailModal
          report={detailReport}
          onClose={() => {
            setDetailReport(null);
            fetchReports(page, true);
          }}
          onResendDone={(newLogId) => {
            setDetailReport(null);
            fetchReports(1, true);
            setPage(1);
            if (newLogId) {
              router.push(`/panel/sms-reports?highlight=${newLogId}`);
            }
          }}
        />
      )}
    </div>
  );
}

function CampaignDetailModal({
  report,
  onClose,
  onResendDone,
}: {
  report: SmsReport;
  onClose: () => void;
  onResendDone: (newLogId?: string) => void;
}) {
  const [tab, setTab] = useState<'sent' | 'unsent'>('sent');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [resending, setResending] = useState(false);
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setPage(1);
  }, [appliedSearch, tab]);

  const fetchDetail = useCallback(async () => {
    const soft = !isFirstLoad.current;
    if (soft) setSearching(true);
    else setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
        status: tab === 'sent' ? 'sent' : 'unsent',
      });
      if (appliedSearch) {
        params.set('search', appliedSearch);
      }

      const res = await fetch(`${API_URL}/sms/reports/${report.id}/recipients?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: DetailResponse = await res.json();
        setDetail(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setSearching(false);
      isFirstLoad.current = false;
    }
  }, [report.id, page, appliedSearch, tab]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const runSearch = () => {
    setAppliedSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  const handleResend = async () => {
    const count = detail?.unsentCount ?? 0;
    if (count <= 0) {
      alert('Gönderilecek kalan alıcı yok');
      return;
    }
    if (
      !confirm(
        `${count.toLocaleString('tr-TR')} kişiye tekrar SMS gönderilsin mi?\n\nŞablon: ${detail?.log.template?.name || report.template?.name || '-'}\nŞablonda yaptığın son değişiklikler kullanılır.\n\nVarsayılan: 10.000'er batch · 30 dk aralık`,
      )
    ) {
      return;
    }
    setResending(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/sms/reports/${report.id}/resend-unsent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dailyLimit: 10000, intervalHours: 0.5 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Tekrar gönderim başarısız');
        return;
      }
      alert(
        `Tekrar gönderim başlatıldı.\nHemen: ${data.sentNow ?? 0}\nKuyruk: ${data.queued ?? 0}\nHariç (unsubscribe): ${data.excludedUnsubscribed ?? 0}`,
      );
      onResendDone(data.logId);
    } catch (e) {
      console.error(e);
      alert('Tekrar gönderim hatası');
    } finally {
      setResending(false);
    }
  };

  const rows = detail?.data ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{report.label}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {report.template?.name || 'Şablon'} ·{' '}
              {report.platform ? PLATFORM_LABELS[report.platform] || report.platform : '-'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-3 text-sm">
          <span className="text-green-700 font-medium">
            Gönderilen: {(detail?.stats.sent ?? report.stats.sent).toLocaleString('tr-TR')}
          </span>
          <span className="text-red-600 font-medium">
            Başarısız: {(detail?.stats.failed ?? report.stats.failed).toLocaleString('tr-TR')}
          </span>
          <span className="text-amber-600 font-medium">
            Kalan: {(detail?.unsentCount ?? 0).toLocaleString('tr-TR')}
          </span>
        </div>

        <div className="px-6 pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('sent')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              tab === 'sent' ? 'bg-[#2b2973] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Kimlere gönderdik
          </button>
          <button
            type="button"
            onClick={() => setTab('unsent')}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              tab === 'unsent' ? 'bg-[#2b2973] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Gönderilemeyenler
          </button>
        </div>

        <div className="px-6 pt-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runSearch();
                  }
                }}
                placeholder="Telefon / isim / e-posta yazın..."
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={runSearch}
              disabled={searching}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[#2b2973] text-white hover:bg-[#3a3890] disabled:opacity-60 shrink-0"
            >
              {searching ? '...' : 'Ara'}
            </button>
            {appliedSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-3 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 shrink-0"
              >
                Temizle
              </button>
            )}
          </div>
          {tab === 'unsent' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 space-y-1">
              <p>
                Gönderilemeyenlere <strong>{detail?.log.template?.name || report.template?.name || 'aynı şablon'}</strong> ile
                yeni kampanya açılır (10.000 / 30 dk).
              </p>
              <p className="text-amber-800">
                Şablonda değişiklik yaptıysan <strong>güncel hali</strong> gider.
              </p>
            </div>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto px-6 py-3 min-h-[280px] ${searching ? 'opacity-60' : ''}`}>
          {loading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-6 w-6 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : rows.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">
              {appliedSearch
                ? 'Aramanızla eşleşen kayıt yok'
                : tab === 'sent'
                  ? 'Gönderilen kayıt yok'
                  : 'Gönderilemeyen kayıt yok'}
            </p>
          ) : (
            <div className="space-y-1">
              {rows.map((row) => (
                <div
                  key={`${row.gsm}-${row.status}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {row.fullName || row.gsm}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {row.gsm}
                      {row.email ? ` · ${row.email}` : ''}
                    </p>
                    {row.errorMsg && (
                      <p className="text-[11px] text-red-500 truncate">{row.errorMsg}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {detail && detail.meta.totalPages > 1 && (
              <>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40"
                >
                  ‹
                </button>
                <span>
                  {page}/{detail.meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= detail.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40"
                >
                  ›
                </button>
              </>
            )}
            {detail && (
              <span className="text-xs text-gray-400">
                {detail.meta.total.toLocaleString('tr-TR')} kayıt
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Kapat
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || (detail?.unsentCount ?? 0) <= 0}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending
                ? 'Gönderiliyor...'
                : `Gönderilemeyenlere gönder (${(detail?.unsentCount ?? 0).toLocaleString('tr-TR')})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
