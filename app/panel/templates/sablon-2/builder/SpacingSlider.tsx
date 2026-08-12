'use client';

type RangeSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export function RangeSlider({ label, value, min, max, step = 2, onChange }: RangeSliderProps) {
  const clamped = Math.min(max, Math.max(min, value));
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] font-semibold text-gray-500">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 flex-1 cursor-pointer accent-[#ae256c]"
      />
      <span className="w-12 shrink-0 text-right text-[11px] font-mono text-gray-600">{clamped}px</span>
    </div>
  );
}
