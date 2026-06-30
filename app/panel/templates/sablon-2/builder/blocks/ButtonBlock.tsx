'use client';

import { ButtonBlock as ButtonBlockType } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

export default function ButtonBlock({ block }: { block: ButtonBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Buton">
      <div className="px-6 py-4" style={{ textAlign: block.style.align }}>
        <a
          href={block.content.url || '#'}
          target={block.content.target}
          onClick={(event) => event.preventDefault()}
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'button'
                ? { ...current, content: { ...current.content, text: event.currentTarget.textContent || 'Buton' } }
                : current,
            )
          }
          style={{
            display: 'inline-block',
            width: 'auto',
            maxWidth: '100%',
            background: block.style.bg,
            color: block.style.color,
            borderRadius: block.style.borderRadius,
            padding: block.style.padding,
            fontSize: block.style.fontSize,
            textDecoration: 'none',
            fontWeight: 700,
            boxSizing: 'border-box',
          }}
          className="mx-auto inline-block w-auto max-w-full outline-none"
        >
          {block.content.text}
        </a>
      </div>
    </BlockFrame>
  );
}
