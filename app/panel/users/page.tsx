'use client';

import { useState, useEffect } from 'react';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchRoles();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Users fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Roles fetch error:', error);
    }
  };

  const updateUserRole = async (userId: string, roleId: string | null) => {
    setUpdating(userId);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roleId })
      });
      if (res.ok) {
        fetchUsers();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Kullanıcılar</h1>
        <span className="text-sm text-gray-500">{users.length} kullanıcı</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#2b2973] rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Kullanıcı</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">E-posta</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Rol</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Durum</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Kayıt</th>
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2b2973] flex items-center justify-center text-white text-sm font-medium">
                          {u.fullName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.fullName || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role?.id || ''}
                        onChange={(e) => updateUserRole(u.id, e.target.value || null)}
                        disabled={updating === u.id}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#2b2973] focus:border-[#2b2973] disabled:opacity-50 text-gray-900"
                      >
                        <option value="">Rol Yok</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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
    </div>
  );
}

