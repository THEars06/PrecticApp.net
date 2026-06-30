'use client';

import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const PAGE_SIZE = 20;

type UnsubscribeRow = {
  id: string;
  email: string;
  platform: string;
  userId: string | null;
  createdAt: string;
};

type UnsubscribesResponse = {
  data: UnsubscribeRow[];
  summary: { total: number; gise: number; kupon: number };
  meta: { page: number; limit: number; total: number; totalPages: number };
};

const PLATFORM_LABELS: Record<string, string> = {
  gise: 'Gişe Kıbrıs',
  kupon: 'Kupon Kıbrıs',
};

const PLATFORM_COLORS: Record<string, string> = {
  gise: 'bg-indigo-100 text-indigo-700',
  kupon: 'bg-orange-100 text-orange-700',
};

export default function MailUnsubscribesPage() {
  const [rows, setRows] = useState<UnsubscribeRow[]>([]);
  const [summary, setSummary] = useState({ total: 0, gise: 0, kupon: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [platform, setPlatform] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [confirmRow, setConfirmRow] = useState<UnsubscribeRow | null>(null);

  const fetchRows = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
      });
      if (platform) params.set('platform', platform);
      if (search) params.set('search', search);

      const res = await fetch(`${API_URL}/mail/unsubscribes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: UnsubscribesResponse = await res.json();
        setRows(data.data ?? []);
        setSummary(data.summary ?? { total: 0, gise: 0, kupon: 0 });
        setTotalPages(data.meta?.totalPages ?? 1);
        setTotal(data.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('Abonelikten çıkanlar yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [platform, search]);

  useEffect(() => {
    fetchRows(page);
  }, [page, fetchRows]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setPlatform('');
    setPage(1);
  };

  const handleRestore = async () => {
    if (!confirmRow) return;

    setRestoringId(confirmRow.id);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/mail/unsubscribes/${confirmRow.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setConfirmRow(null);
        const nextPage = rows.length === 1 && page > 1 ? page - 1 : page;
        setPage(nextPage);
        await fetchRows(nextPage, true);
      } else {
        const payload = await res.json().catch(() => null);
        alert(payload?.message || 'Geri alma işlemi başarısız oldu.');
      }
    } catch (error) {
      console.error('Geri alma hatası:', error);
      alert('Bir hata oluştu.');
    } finally {
      setRestoringId(null);
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

  const hasFilters = Boolean(search || platform);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abonelikten Çıkanlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kim hangi işletmeden çıktı — arayın, gerekirse aboneliği geri alın
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchRows(page, true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {refreshing ? 'Güncelleniyor...' : 'Yenile'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Toplam', value: summary.total, color: 'text-[#2b2973]' },
          { label: 'Gişe Kıbrıs', value: summary.gise, color: 'text-indigo-600' },
          { label: 'Kupon Kıbrıs', value: summary.kupon, color: 'text-orange-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value.toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch();
              }}
              placeholder="E-posta ile ara..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-[#2b2973]"
            />
          </div>
          <select
            value={platform}
            onChange={(event) => {
              setPlatform(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#2b2973] bg-white min-w-[180px]"
          >
            <option value="">Tüm işletmeler</option>
            <option value="gise">Gişe Kıbrıs</option>
            <option value="kupon">Kupon Kıbrıs</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-xl bg-[#2b2973] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f1d5c]"
            >
              Ara
            </button>
            {hasFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Temizle
              </button>
            ) : null}
          </div>
        </div>

        {hasFilters ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Aktif filtreler:</span>
            {search ? (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 font-medium text-[#2b2973]">
                E-posta: {search}
              </span>
            ) : null}
            {platform ? (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 font-medium text-[#2b2973]">
                İşletme: {PLATFORM_LABELS[platform] || platform}
              </span>
            ) : null}
            <span className="text-gray-400">· {total.toLocaleString('tr-TR')} sonuç</span>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Toplam {summary.total.toLocaleString('tr-TR')} kayıt listeleniyor
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">{hasFilters ? 'Aramanıza uygun kayıt bulunamadı' : 'Henüz abonelikten çıkan yok'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">E-posta</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">İşletme / Uygulama</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Çıkış Tarihi</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          PLATFORM_COLORS[row.platform] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {PLATFORM_LABELS[row.platform] || row.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setConfirmRow(row)}
                        disabled={restoringId === row.id}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        Geri Al
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && total > 0 ? (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {total.toLocaleString('tr-TR')} kayıt
              {totalPages > 1 ? ` · Sayfa ${page}/${totalPages}` : ''}
            </p>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  Sonraki
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {confirmRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Aboneliği geri al</h3>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{confirmRow.email}</span> adresi tekrar{' '}
              <span className="font-semibold text-gray-900">
                {PLATFORM_LABELS[confirmRow.platform] || confirmRow.platform}
              </span>{' '}
              mail listesine eklenecek.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmRow(null)}
                disabled={Boolean(restoringId)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => void handleRestore()}
                disabled={Boolean(restoringId)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {restoringId ? 'Geri alınıyor...' : 'Geri Al'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
