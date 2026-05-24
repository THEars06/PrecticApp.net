'use client';

import { DividerBlock as DividerBlockType } from '../types';
import BlockFrame from './BlockFrame';

export default function DividerBlock({ block }: { block: DividerBlockType }) {
  return (
    <BlockFrame id={block.id} label="Ayırıcı">
      <div style={{ padding: block.style.padding }}>
        <div style={{ borderTop: `${block.style.thickness} solid ${block.style.color}` }} />
      </div>
    </BlockFrame>
  );
}
