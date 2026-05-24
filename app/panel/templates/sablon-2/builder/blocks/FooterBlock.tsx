'use client';

import { FooterBlock as FooterBlockType } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

export default function FooterBlock({ block }: { block: FooterBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Footer">
      <div
        style={{
          background: block.style.bg,
          color: block.style.color,
          fontSize: block.style.fontSize,
          padding: block.style.padding,
          textAlign: block.style.align,
        }}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'footer'
                ? { ...current, content: { ...current.content, company: event.currentTarget.textContent || '' } }
                : current,
            )
          }
          className="font-bold outline-none"
        >
          {block.content.company}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) =>
            updateBlock(block.id, (current) =>
              current.type === 'footer'
                ? { ...current, content: { ...current.content, text: event.currentTarget.textContent || '' } }
                : current,
            )
          }
          className="mt-2 leading-6 outline-none"
        >
          {block.content.text}
        </div>
        <span className="mt-3 inline-block font-semibold" style={{ color: block.style.linkColor }}>
          {block.content.unsubscribeText}
        </span>
      </div>
    </BlockFrame>
  );
}
