'use client';

import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Hoş geldin, {user?.fullName?.split(' ')[0] || 'Kullanıcı'}</h1>
          <p className="text-sm text-gray-500">Platformlarınızı buradan yönetin</p>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          isAdmin ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {isAdmin ? 'Admin' : 'Operatör'}
        </span>
      </div>

      {/* Platform Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gişe Kıbrıs Card */}
        <a 
          href="https://www.gisekibris.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Gişe Kıbrıs</h3>
              <p className="text-sm text-gray-500 mt-1">Etkinlik biletleri ve konserler</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>

        {/* Kupon Kıbrıs Card */}
        <a 
          href="https://www.kuponkibris.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-cyan-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Kupon Kıbrıs</h3>
              <p className="text-sm text-gray-500 mt-1">İndirim kuponları ve kampanyalar</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Giriş', value: '24', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' },
          { label: 'Aktif Oturum', value: '1', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Bağlı Uygulama', value: '2', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
          { label: 'Durum', value: 'Aktif', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
              </svg>
            </div>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Hesap Bilgileri</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">E-posta</span>
            <p className="text-gray-900 mt-0.5">{user?.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Ad Soyad</span>
            <p className="text-gray-900 mt-0.5">{user?.fullName || '-'}</p>
          </div>
          <div>
            <span className="text-gray-500">Rol</span>
            <p className="text-gray-900 mt-0.5">{isAdmin ? 'Admin' : 'Operatör'}</p>
          </div>
          <div>
            <span className="text-gray-500">Kullanıcı ID</span>
            <p className="text-gray-600 font-mono text-xs mt-0.5">{user?.id?.slice(0, 8)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
         