'use client';

export interface SpacingInfo {
  mt: number;
  mb: number;
  ml: number;
  mr: number;
  prevName: string;
  nextName: string;
  selectedName: string;
}

interface SpacingPanelProps {
  spacingInfo: SpacingInfo;
  onUpdateSpacing: (prop: 'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right', val: number) => void;
}

export default function SpacingPanel({ spacingInfo, onUpdateSpacing }: SpacingPanelProps) {
  return (
    <div className="p-3 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Katman Arası Boşluk</div>

      {spacingInfo.prevName && (
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"/>
          <span className="text-[11px] text-gray-400 truncate">{spacingInfo.prevName}</span>
        </div>
      )}

      <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 mb-1.5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-500"/>
          <span className="text-[11px] font-semibold text-blue-700 truncate">{spacingInfo.selectedName}</span>
        </div>
        <div className="space-y-2">
          {([
            { label: '\u2191 Üst', prop: 'margin-top' as const, key: 'mt' as const },
            { label: '\u2193 Alt', prop: 'margin-bottom' as const, key: 'mb' as const },
            { label: '\u2190 Sol', prop: 'margin-left' as const, key: 'ml' as const },
            { label: '\u2192 Sağ', prop: 'margin-right' as const, key: 'mr' as const },
          ]).map(({ label, prop, key }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-[10px] text-blue-500 w-7 shrink-0">{label}</span>
              <input
                type="range" min="-40" max="80" step="5"
                value={spacingInfo[key]}
                onChange={(e) => onUpdateSpacing(prop, Number(e.target.value))}
                className="flex-1 h-1.5 accent-blue-500 cursor-pointer"
              />
              <input
                type="number" min="-200" max="200" step="1"
                value={spacingInfo[key]}
                onChange={(e) => onUpdateSpacing(prop, Number(e.target.value) || 0)}
                className={`w-12 text-center text-[10px] font-mono border rounded px-1 py-0.5 outline-none focus:border-blue-400 ${spacingInfo[key] < 0 ? 'text-red-500 border-red-200 bg-red-50/50' : 'text-blue-600 border-blue-200 bg-white'}`}
              />
              <span className="text-[9px] text-gray-400">px</span>
            </div>
          ))}
        </div>
      </div>

      {spacingInfo.nextName && (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"/>
          <span className="text-[11px] text-gray-400 truncate">{spacingInfo.nextName}</span>
        </div>
      )}
    </div>
  );
}
