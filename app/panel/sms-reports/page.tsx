'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

const STATUS_LABELS: Record<string, string> = {
  sent: 'Tamamlandı',
  scheduled: 'Zamanlandı',
  pending: 'Bekliyor',
  failed: 'Başarısız',
  partial: 'Kısmi',
};

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  partial: 'bg-orange-100 text-orange-700',
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
          <svg
            className="animate-spin h-8 w-8 text-[#2b2973]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
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
        setSummary(
          data.summary ?? {
            sent: 0,
            failed: 0,
            pending: 0,
            sending: 0,
            campaigns: 0,
          },
        );
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
        <button
          onClick={() => fetchReports(page, true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-[#2b2973] text-white disabled:opacity-60"
        >
          {refreshing ? 'Güncelleniyor...' : 'Verileri Güncelle'}
        </button>
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
            <svg
              className="animate-spin h-8 w-8 text-[#2b2973]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Henüz SMS kampanyası bulunmuyor
          </div>
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
                        <p
                          className="font-medium text-gray-900 max-w-[200px] truncate"
                          title={report.label}
                        >
                          {report.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {report.provider.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {report.platform
                          ? PLATFORM_LABELS[report.platform] || report.platform
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {report.template?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(report.createdAt)}
                      </td>
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
                        {(report.stats.pending + report.stats.sending).toLocaleString(
                          'tr-TR',
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[report.status] ||
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {STATUS_LABELS[report.status] || report.status}
                        </span>
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
    </div>
  );
}
