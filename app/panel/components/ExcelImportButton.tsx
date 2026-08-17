'use client';

import { useRef, useState } from 'react';
import {
  ExcelColumnKind,
  ParseExcelResult,
  parseExcelFirstColumn,
} from '@/lib/parseExcelColumn';

type ExcelImportButtonProps = {
  kind: ExcelColumnKind;
  onImported: (values: string[], result: ParseExcelResult, fileName: string) => void;
};

const COPY: Record<
  ExcelColumnKind,
  { label: string; hint: string; empty: string }
> = {
  phone: {
    label: 'Excel İçe Aktar',
    hint: 'Tek kolon: telefon numaraları (.xlsx, .xls, .csv)',
    empty: 'Dosyada geçerli telefon numarası bulunamadı',
  },
  email: {
    label: 'Excel İçe Aktar',
    hint: 'Tek kolon: e-posta adresleri (.xlsx, .xls, .csv)',
    empty: 'Dosyada geçerli e-posta adresi bulunamadı',
  },
};

export default function ExcelImportButton({ kind, onImported }: ExcelImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[kind];

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await parseExcelFirstColumn(file, kind);
      if (result.values.length === 0) {
        setError(copy.empty);
        return;
      }
      onImported(result.values, result, file.name);
    } catch (err) {
      console.error('Excel okunamadı:', err);
      setError('Dosya okunamadı. .xlsx, .xls veya .csv yükleyin.');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-60"
      >
        {loading ? (
          <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}
        {loading ? 'Okunuyor...' : copy.label}
      </button>
      <p className="text-[10px] text-gray-400">{copy.hint}</p>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
