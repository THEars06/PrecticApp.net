'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// GrapesJS'i client-side only olarak yükle
const TemplateEditor = dynamic(
  () => import('../components/TemplateEditor'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin h-8 w-8 border-4 border-[#2b2973] border-t-transparent rounded-full"></div></div> }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

type Template = {
  id: string;
  name: string;
  description: string | null;
  htmlContent: string;
  cssContent: string | null;
  gjsData: any;
};

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingInfo, setEditingInfo] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/templates/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTemplate(data);
          setName(data.name);
          setDescription(data.description || '');
        } else {
          router.push('/panel/templates');
        }
      } catch (error) {
        console.error('Şablon yüklenirken hata:', error);
        router.push('/panel/templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, router]);

  const handleSave = async (data: { html: string; css: string; gjsData: any }) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/templates/${id}`, {
        method: 'PATCH',
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
        // Show success feedback
        const btn = document.querySelector('[data-save-btn]');
        if (btn) {
          btn.classList.add('!bg-green-500');
          setTimeout(() => btn.classList.remove('!bg-green-500'), 1500);
        }
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

  const handleInfoSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${API_URL}/templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      setEditingInfo(false);
    } catch (error) {
      console.error('Bilgiler kaydedilirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-[#2b2973]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/panel/templates"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          {editingInfo ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                onClick={handleInfoSave}
                className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setName(template.name);
                  setDescription(template.description || '');
                  setEditingInfo(false);
                }}
                className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                <p className="text-sm text-gray-500">{description || 'Şablon düzenleme'}</p>
              </div>
              <button
                onClick={() => setEditingInfo(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <TemplateEditor
        initialHtml={template.htmlContent}
        initialCss={template.cssContent || ''}
        initialGjsData={template.gjsData}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
