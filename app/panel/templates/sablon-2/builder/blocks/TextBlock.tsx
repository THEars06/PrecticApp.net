'use client';

import { TextBlock as TextBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { getBlockPadding } from '../blockStyle';
import BlockFrame from './BlockFrame';

export default function TextBlock({ block }: { block: TextBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Metin" backgroundColor={block.style.blockBg}>
      <div style={{ padding: getBlockPadding(block) ?? '12px 24px' }}>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'text'
                ? { ...current, content: { html: event.currentTarget.innerText || '' } }
                : current,
            )
          }
          style={{
            color: block.style.color,
            fontSize: block.style.fontSize,
            lineHeight: block.style.lineHeight,
            textAlign: block.style.align,
          }}
          className="min-h-6 whitespace-pre-wrap outline-none"
        >
          {block.content.html}
        </div>
      </div>
    </BlockFrame>
  );
}
