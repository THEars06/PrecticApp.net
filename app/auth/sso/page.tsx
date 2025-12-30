'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function SSOLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithSsoToken, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSSO = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Token bulunamadı');
        setIsLoading(false);
        return;
      }

      const result = await loginWithSsoToken(token);

      if (result.success) {
        router.push('/panel');
      } else {
        setError(result.error || 'SSO girişi başarısız');
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      handleSSO();
    } else {
      router.push('/panel');
    }
  }, [searchParams, loginWithSsoToken, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        {isLoading && !error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-[#2b2973] rounded-full animate-spin"></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Giriş yapılıyor...</h2>
              <p className="text-gray-500">Lütfen bekleyin</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Giriş Başarısız</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <a
              href="/"
              className="inline-block px-6 py-2.5 bg-[#2b2973] text-white font-medium rounded-lg hover:bg-[#1e1d52] transition-all"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SSOPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-3 border-gray-200 border-t-[#2b2973] rounded-full animate-spin"></div>
      </div>
    }>
      <SSOLoginContent />
    </Suspense>
  );
}
