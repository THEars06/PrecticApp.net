'use client';

import { HeadingBlock as HeadingBlockType } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

export default function HeadingBlock({ block }: { block: HeadingBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const Tag = `h${block.content.level}` as 'h1' | 'h2' | 'h3';

  return (
    <BlockFrame id={block.id} label="Başlık">
      <div className="px-6 py-4">
        <Tag
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
          }}
          className="m-0 outline-none"
        >
          {block.content.text}
        </Tag>
      </div>
    </BlockFrame>
  );
}
