'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ReactNode } from 'react';
import { useTemplate2Store } from '../store';

type Props = {
  id: string;
  label: string;
  children: ReactNode;
};

export default function BlockFrame({ id, label, children }: Props) {
  const selectedId = useTemplate2Store((state) => state.selectedId);
  const selectBlock = useTemplate2Store((state) => state.selectBlock);
  const removeBlock = useTemplate2Store((state) => state.removeBlock);
  const duplicateBlock = useTemplate2Store((state) => state.duplicateBlock);
  const moveBlockByOffset = useTemplate2Store((state) => state.moveBlockByOffset);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const selected = selectedId === id;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={(event) => {
        event.stopPropagation();
        selectBlock(id);
      }}
      className={`group relative rounded-xl border-2 bg-white transition-all ${
        selected ? 'border-emerald-500 shadow-lg shadow-emerald-100' : 'border-transparent hover:border-purple-200'
      } ${isDragging ? 'opacity-60' : ''}`}
    >
      <div className="absolute -top-3 left-3 z-10 hidden items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 shadow-sm group-hover:flex">
        <button
          type="button"
          className="cursor-grab rounded px-1 text-gray-500 hover:bg-gray-100"
          title="Taşı"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        <span>{label}</span>
        <button type="button" onClick={() => moveBlockByOffset(id, -1)} className="rounded px-1 hover:bg-gray-100" title="Yukarı">
          ↑
        </button>
        <button type="button" onClick={() => moveBlockByOffset(id, 1)} className="rounded px-1 hover:bg-gray-100" title="Aşağı">
          ↓
        </button>
        <button type="button" onClick={() => duplicateBlock(id)} className="rounded px-1 hover:bg-gray-100" title="Kopyala">
          ⧉
        </button>
        <button type="button" onClick={() => removeBlock(id)} className="rounded px-1 text-red-500 hover:bg-red-50" title="Sil">
          ×
        </button>
      </div>
      {children}
    </div>
  );
}
