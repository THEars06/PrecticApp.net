'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  role: { id: string; name: string } | null;
  isActive: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface UsersResponse {
  data: UserData[];
  total: number;
  page: number;
  limit: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const PAGE_SIZE = 50;

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const isAdmin = user?.role === 'admin';

  const fetchUsers = useCallback(
    async (searchTerm: string, pageNum: number) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const params = new URLSearchParams({
          search: searchTerm,
          page: String(pageNum),
          limit: String(PAGE_SIZE),
        });
        const res = await fetch(`${API_URL}/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: UsersResponse = await res.json();
          setUsers(data.data ?? []);
          setTotal(data.total ?? 0);
        }
      } catch (error) {
        console.error('Users fetch error:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchRoles = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Roles fetch error:', error);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchRoles();
    }
  }, [isAdmin, fetchRoles]);

  // Search debounce — kullanici yazmayi birakir birakmaz arama
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isAdmin) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers(search, page);
  }, [search, page, isAdmin, fetchUsers]);

  const updateUserRole = async (userId: string, roleId: string | null) => {
    setUpdating(userId);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleId }),
      });

      if (res.ok) {
        fetchUsers(search, page);
      }
    } catch (error) {
      console.error('Role update error:', error);
    } finally {
      setUpdating(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bu sayfaya erişim yetkiniz yok.</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Kullanıcılar</h1>
        <span className="text-sm text-gray-500">
          {total.toLocaleString('tr-TR')} kullanıcı
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="E-posta veya ad ara..."
            className="w-full px-4 py-2 pr-9 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2973]/20 focus:border-[#2b2973] text-gray-900 placeholder-gray-400"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Temizle"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#2b2973] rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Kullanıcı bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Kullanıcı
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    E-posta
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Kayıt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2b2973] flex items-center justify-center text-white text-sm font-medium">
                          {u.fullName?.charAt(0) ||
                            u.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {u.fullName || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role?.id || ''}
                        onChange={(e) =>
                          updateUserRole(u.id, e.target.value || null)
                        }
                        disabled={updating === u.id}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#2b2973] focus:border-[#2b2973] disabled:opacity-50 text-gray-900"
                      >
                        <option value="">Rol Yok</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-500">
            {startIdx.toLocaleString('tr-TR')} -{' '}
            {endIdx.toLocaleString('tr-TR')} /{' '}
            {total.toLocaleString('tr-TR')} kullanıcı
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="text-xs text-gray-500 px-2">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
