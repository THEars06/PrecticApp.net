'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Template = {
  id: string;
  name: string;
  description: string | null;
  htmlContent: string;
  cssContent: string | null;
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  
  // Kod ile oluştur modal state'leri
  const [codeModal, setCodeModal] = useState(false);
  const [codeName, setCodeName] = useState('');
  const [codeDescription, setCodeDescription] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Şablonlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== id));
        setDeleteModal(null);
      }
    } catch (error) {
      console.error('Şablon silinirken hata:', error);
    }
  };

  // Kod ile şablon oluştur
  const handleCodeSubmit = async () => {
    if (!codeName.trim() || !htmlCode.trim()) {
      alert('Şablon adı ve HTML kodu zorunludur!');
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
          name: codeName,
          description: codeDescription || null,
          htmlContent: htmlCode,
          cssContent: null,
          gjsData: null,
        }),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates([newTemplate, ...templates]);
        setCodeModal(false);
        setCodeName('');
        setCodeDescription('');
        setHtmlCode('');
        setShowPreview(false);
      } else {
        alert('Şablon kaydedilemedi!');
      }
    } catch (error) {
      console.error('Şablon oluşturulurken hata:', error);
      alert('Bir hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  const resetCodeModal = () => {
    setCodeModal(false);
    setCodeName('');
    setCodeDescription('');
    setHtmlCode('');
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mail Şablonları</h1>
          <p className="text-sm text-gray-500 mt-1">Mail şablonlarınızı oluşturun ve yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCodeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#2b2973] text-[#2b2973] text-sm font-medium rounded-xl hover:bg-[#2b2973]/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Kod ile Oluştur
          </button>
          <Link
            href="/panel/templates/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Şablon
          </Link>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz şablon yok</h3>
          <p className="text-gray-500 mb-6">İlk mail şablonunuzu oluşturmak için başlayın</p>
          <Link
            href="/panel/templates/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2b2973] text-white text-sm font-medium rounded-lg hover:bg-[#1e1e5c] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Şablon Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              {/* Thumbnail / Preview - HTML önizleme */}
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                {template.htmlContent ? (
                  <iframe
                    srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:8px;transform:scale(0.4);transform-origin:top left;width:250%;pointer-events:none;}${template.cssContent || ''}</style></head><body>${template.htmlContent}</body></html>`}
                    className="w-full h-full border-0 pointer-events-none"
                    title={template.name}
                    sandbox=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/panel/templates/${template.id}`}
                    className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => setDeleteModal(template.id)}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description || 'Açıklama yok'}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(template.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <Link
                    href={`/panel/templates/${template.id}`}
                    className="text-xs text-[#2b2973] font-medium hover:underline"
                  >
                    Düzenle →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Şablonu Sil</h3>
            <p className="text-gray-500 text-center text-sm mb-6">Bu şablonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kod ile Oluştur Modal */}
      {codeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-[#2b2973] to-[#4a3f9f]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Kod ile Şablon Oluştur</h2>
                  <p className="text-sm text-white/70">HTML ve CSS kodunuzu yapıştırın</p>
                </div>
              </div>
              <button
                onClick={resetCodeModal}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sol Taraf - Form ve Kod Alanları */}
              <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
                {/* Şablon Bilgileri */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Şablon Adı <span className="text-red-500 text-black">*</span>
                      </label>
                      <input
                        type="text"
                        value={codeName}
                        onChange={(e) => setCodeName(e.target.value)}
                        placeholder="Örn: Hoşgeldin Maili"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2973]/20 focus:border-[#2b2973] text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Açıklama
                      </label>
                      <input
                        type="text"
                        value={codeDescription}
                        onChange={(e) => setCodeDescription(e.target.value)}
                        placeholder="Kısa bir açıklama..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2b2973]/20 focus:border-[#2b2973] text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Kod Alanı - Tek Alan (HTML + CSS birlikte) */}
                <div className="flex-1 overflow-auto p-5">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-bold">
                          &lt;/&gt;
                        </span>
                        HTML Kodu (CSS dahil) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400">{htmlCode.length} karakter</span>
                    </div>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      placeholder={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Mail içeriğiniz buraya -->
    <h1>Merhaba!</h1>
    <p>Bu bir mail şablonudur.</p>
  </div>
</body>
</html>`}
                      className="w-full flex-1 min-h-[400px] px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono bg-gray-900 text-green-400 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2b2973]/20 focus:border-[#2b2973] resize-none"
                      spellCheck={false}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                       CSS kodlarınızı &lt;style&gt; etiketi içinde HTML'e dahil edin
                    </p>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - Önizleme */}
              {showPreview && (
                <div className="w-1/2 flex flex-col bg-gray-50">
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Canlı Önizleme
                    </h3>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      {htmlCode ? (
                        <iframe
                          srcDoc={htmlCode}
                          className="w-full min-h-[500px] border-0"
                          title="Önizleme"
                          sandbox="allow-same-origin"
                        />
                      ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">HTML kodu girin</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showPreview 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Önizlemeyi Kapat' : 'Önizle'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={resetCodeModal}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleCodeSubmit}
                  disabled={saving || !codeName.trim() || !htmlCode.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#2b2973] to-[#4a3f9f] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Şablonu Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
