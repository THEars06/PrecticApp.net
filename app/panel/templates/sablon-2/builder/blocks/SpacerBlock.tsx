'use client';

import { SpacerBlock as SpacerBlockType } from '../types';
import BlockFrame from './BlockFrame';

export default function SpacerBlock({ block }: { block: SpacerBlockType }) {
  return (
    <BlockFrame id={block.id} label="Boşluk">
      <div className="flex items-center justify-center bg-gray-50 text-xs text-gray-400" style={{ height: block.style.height }}>
        Boşluk: {block.style.height}
      </div>
    </BlockFrame>
  );
}
