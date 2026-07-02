'use client';

import { CouponBlock as CouponBlockType } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

export default function CouponBlock({ block }: { block: CouponBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Kupon / Kod" backgroundColor={block.style.bg}>
      <div className="px-6 py-4">
        <div
          style={{
            background: block.style.bg,
            border: `2px dashed ${block.style.borderColor}`,
            borderRadius: block.style.borderRadius,
            color: block.style.textColor,
            padding: block.style.padding,
            textAlign: block.style.align,
          }}
        >
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'coupon'
                  ? { ...current, content: { ...current.content, label: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="text-sm font-bold uppercase tracking-wide outline-none"
          >
            {block.content.label}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'coupon'
                  ? { ...current, content: { ...current.content, code: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="mt-2 font-black tracking-[0.2em] outline-none"
            style={{ color: block.style.codeColor, fontSize: block.style.codeFontSize }}
          >
            {block.content.code}
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'coupon'
                  ? { ...current, content: { ...current.content, description: event.currentTarget.textContent || '' } }
                  : current,
              )
            }
            className="mt-2 text-sm opacity-80 outline-none"
          >
            {block.content.description}
          </div>
        </div>
      </div>
    </BlockFrame>
  );
}
