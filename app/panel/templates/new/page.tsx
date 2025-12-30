'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// GrapesJS'i client-side only olarak yükle (SSR'da çalışmaz)
const TemplateEditor = dynamic(
  () => import('../components/TemplateEditor'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin h-8 w-8 border-4 border-[#2b2973] border-t-transparent rounded-full"></div></div> }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleSave = async (data: { html: string; css: string; gjsData: any }) => {
    if (!name.trim()) {
      alert('Lütfen şablon adı girin');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          htmlContent: data.html,
          cssContent: data.css,
          gjsData: data.gjsData,
        }),
      });

      if (response.ok) {
        router.push('/panel/templates');
      } else {
        const error = await response.json();
        alert('Hata: ' + (error.message || 'Şablon kaydedilemedi'));
      }
    } catch (error) {
      console.error('Şablon kaydedilirken hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (!showEditor) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/panel/templates"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Şablon Oluştur</h1>
            <p className="text-sm text-gray-500 mt-1">Şablon bilgilerini girin</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şablon Adı *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Yılbaşı Kampanyası"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Şablon açıklaması..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none text-gray-900"
              />
            </div>
            <button
              onClick={() => setShowEditor(true)}
              disabled={!name.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all ${
                name.trim()
                  ? 'bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white hover:shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editöre Geç
            </button>   
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowEditor(false)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500">{description || 'Yeni şablon'}</p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <TemplateEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
