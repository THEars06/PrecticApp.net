'use client';

import { HeadingBlock as HeadingBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { getBlockPadding } from '../blockStyle';
import BlockFrame from './BlockFrame';

export default function HeadingBlock({ block }: { block: HeadingBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Başlık" backgroundColor={block.style.blockBg}>
      <div style={{ padding: getBlockPadding(block) ?? '16px 24px' }}>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'heading'
                ? { ...current, content: { ...current.content, text: event.currentTarget.textContent || '' } }
                : current,
            )
          }
          style={{
            color: block.style.color,
            textAlign: block.style.align,
            fontSize: block.style.fontSize,
            lineHeight: 1.25,
            fontWeight: 700,
          }}
          className="m-0 outline-none"
        >
          {block.content.text}
        </div>
      </div>
    </BlockFrame>
  );
}
