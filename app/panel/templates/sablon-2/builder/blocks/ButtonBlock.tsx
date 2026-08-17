'use client';

import { ButtonBlock as ButtonBlockType } from '../types';
import { useTemplate2Store } from '../store';
import { mobileButtonFont, mobileButtonPadding } from '../mobileButtonScale';
import BlockFrame from './BlockFrame';

export default function ButtonBlock({ block }: { block: ButtonBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const device = useTemplate2Store((state) => state.deviceMode);

  return (
    <BlockFrame id={block.id} label="Buton" backgroundColor={block.style.blockBg}>
      <div style={{ textAlign: block.style.align, padding: block.style.blockPadding || '16px 24px' }}>
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
            padding: mobileButtonPadding(block.style.padding, device),
            fontSize: mobileButtonFont(block.style.fontSize, device),
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
