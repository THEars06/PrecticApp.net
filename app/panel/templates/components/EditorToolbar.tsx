'use client';

import type { Editor } from 'grapesjs';

interface EditorToolbarProps {
  editor: Editor | null;
  activeDevice: 'Desktop' | 'Tablet' | 'Mobile';
  onSwitchDevice: (device: 'Desktop' | 'Tablet' | 'Mobile') => void;
  onTextAlign: (align: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onPreview: () => void;
  onSave: () => void;
  saving: boolean;
  showGrid: boolean;
  onToggleGrid: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function EditorToolbar({
  editor,
  activeDevice,
  onSwitchDevice,
  onTextAlign,
  onMoveUp,
  onMoveDown,
  onPreview,
  onSave,
  saving,
  showGrid,
  onToggleGrid,
  isFullscreen,
  onToggleFullscreen,
}: EditorToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button onClick={() => editor?.runCommand('core:undo')} title="Geri Al"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </button>
          <button onClick={() => editor?.runCommand('core:redo')} title="Yinele"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
            </svg>
          </button>
        </div>

        {/* Device */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {([
            { key: 'Desktop' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>, label: 'Masaüstü' },
            { key: 'Tablet' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>, label: 'Tablet' },
            { key: 'Mobile' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>, label: 'Mobil' },
          ]).map(({ key, icon, label }, i, arr) => (
            <button key={key} onClick={() => onSwitchDevice(key)} title={label}
              className={`w-9 h-9 inline-flex items-center justify-center transition-all ${i < arr.length - 1 ? 'border-r border-gray-200' : ''} ${activeDevice === key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
            </button>
          ))}
        </div>

        {/* Text Alignment */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button onClick={() => onTextAlign('left')} title="Sola Hizala"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h18"/>
            </svg>
          </button>
          <button onClick={() => onTextAlign('center')} title="Ortala"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M6 12h12M3 18h18"/>
            </svg>
          </button>
          <button onClick={() => onTextAlign('right')} title="Sağa Hizala"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M9 12h12M3 18h18"/>
            </svg>
          </button>
          <button onClick={() => onTextAlign('justify')} title="İki Yana Yasla"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
        </div>

        {/* Element Controls */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button onClick={onMoveUp} title="Yukarı Taşı"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg>
          </button>
          <button onClick={onMoveDown} title="Aşağı Taşı"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <button onClick={() => editor?.runCommand('tlb-clone')} title="Kopyala"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2}/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2}/>
            </svg>
          </button>
          <button onClick={() => editor?.runCommand('tlb-delete')} title="Sil"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        {/* Tools */}
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          <button onClick={onToggleGrid} title="Izgara"
            className={`w-9 h-9 inline-flex items-center justify-center transition-all border-r border-gray-200 ${showGrid ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-400'}`}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h6v6H3zM9 3h6v6H9zM15 3h6v6h-6zM3 9h6v6H3zM9 9h6v6H9zM15 9h6v6h-6zM3 15h6v6H3zM9 15h6v6H9zM15 15h6v6h-6z"/>
            </svg>
          </button>
          <button onClick={onPreview} title="Önizleme"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border-r border-gray-200">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
          <button onClick={() => editor?.runCommand('core:canvas-clear')} title="Tümünü Temizle"
            className="w-9 h-9 inline-flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Fullscreen + Save */}
      <div className="flex items-center gap-2">
        <button onClick={onToggleFullscreen} title={isFullscreen ? 'Küçült' : 'Tam Ekran'}
          className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          {isFullscreen ? (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
            </svg>
          )}
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Kaydediliyor...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  );
}
