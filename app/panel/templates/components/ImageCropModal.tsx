'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

interface Props {
  file: File;
  onComplete: (url: string, width: number, height: number) => void;
  onClose: () => void;
}

export default function ImageCropModal({ file, onComplete, onClose }: Props) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const getCroppedBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !completedCrop) {
        resolve(null);
        return;
      }
      const canvas = document.createElement('canvas');
      const img = imgRef.current;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(
        img,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0, 0,
        canvas.width,
        canvas.height,
      );
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92);
    });
  }, [completedCrop]);

  const upload = useCallback(async (blob: Blob, filename: string) => {
    const formData = new FormData();
    formData.append('file', blob, filename);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const res = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Yükleme başarısız');
    const data = await res.json();
    return data.url as string;
  }, []);

  const handleCropAndUpload = async () => {
    setUploading(true);
    try {
      const blob = await getCroppedBlob();
      if (!blob || !completedCrop || !imgRef.current) return;
      const url = await upload(blob, file.name);
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const cropW = Math.round(completedCrop.width * scaleX);
      const cropH = Math.round(completedCrop.height * scaleY);
      onComplete(url, cropW, cropH);
    } catch (e) {
      console.error('Kırpma/yükleme hatası:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadOriginal = async () => {
    setUploading(true);
    try {
      const url = await upload(file, file.name);
      const img = imgRef.current;
      const w = img ? img.naturalWidth : 300;
      const h = img ? img.naturalHeight : 200;
      onComplete(url, w, h);
    } catch (e) {
      console.error('Yükleme hatası:', e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Görsel Kırp ve Yükle</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Aspect Ratio Seçimi */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-500 mr-1">Oran:</span>
          {[
            { label: 'Serbest', value: undefined },
            { label: '1:1', value: 1 },
            { label: '4:3', value: 4 / 3 },
            { label: '16:9', value: 16 / 9 },
            { label: '3:2', value: 3 / 2 },
            { label: '2:3', value: 2 / 3 },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAspect(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                aspect === opt.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Crop Alanı */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-100 min-h-0">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[50vh]"
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Kırpılacak görsel"
                style={{ maxHeight: '50vh', maxWidth: '100%', display: 'block' }}
              />
            </ReactCrop>
          ) : (
            <div className="flex items-center justify-center w-full h-40">
              <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white gap-3">
          <button
            onClick={handleUploadOriginal}
            disabled={uploading || !imgSrc}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Kırpmadan Yükle
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleCropAndUpload}
              disabled={uploading || !completedCrop || !imgSrc}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Yükleniyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kırp ve Yükle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
