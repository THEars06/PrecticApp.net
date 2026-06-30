'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const PAGE_SIZE = 20;

type MailStats = {
  sent: number;
  failed: number;
  pending: number;
  sending: number;
};

type MailReport = {
  id: string;
  subject: string;
  recipientCount: number;
  status: string;
  platform: string | null;
  createdAt: string;
  provider: { name: string };
  template: { name: string } | null;
  stats: MailStats;
};

type ReportsResponse = {
  data: MailReport[];
  summary: MailStats & { campaigns: number };
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

export default function MailReportsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <MailReportsContent />
    </Suspense>
  );
}

function MailReportsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [reports, setReports] = useState<MailReport[]>([]);
  const [summary, setSummary] = useState<MailStats & { campaigns: number }>({
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
      const res = await fetch(`${API_URL}/mail/reports?${params}`, {
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
      console.error('Mail raporları yüklenemedi:', error);
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

  const handleRefresh = () => {
    fetchReports(page, true);
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mail Raporları</h1>
          <p className="text-sm text-gray-500 mt-1">
            Etkinlik / kampanya başına gönderim durumunu takip edin
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {refreshing ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Güncelleniyor...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Verileri Güncelle
            </>
          )}
        </button>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Toplam Kampanya', value: summary.campaigns, color: 'text-[#2b2973]', bg: 'bg-purple-50' },
          { label: 'Gönderilen', value: summary.sent, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Başarısız', value: summary.failed, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Bekleyen', value: summary.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Gönderiliyor', value: summary.sending, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value.toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Henüz mail kampanyası bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Konu / Etkinlik</th>
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
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-green-50 ring-2 ring-inset ring-green-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 max-w-[200px] truncate" title={report.subject}>
                          {report.subject}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{report.provider.name}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {report.platform ? PLATFORM_LABELS[report.platform] || report.platform : '-'}
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
                        {(report.stats.pending + report.stats.sending).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[report.status] || 'bg-gray-100 text-gray-600'
                        }`}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Toplam {total.toLocaleString('tr-TR')} kampanya
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
