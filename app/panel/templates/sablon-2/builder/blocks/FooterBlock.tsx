'use client';

import { FooterBlock as FooterBlockType } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

const UNSUBSCRIBE_PLACEHOLDER = '{{UNSUBSCRIBE_URL}}';

function resolveFooterLinkHref(unsubscribeUrl: string): string {
  if (!unsubscribeUrl || unsubscribeUrl === UNSUBSCRIBE_PLACEHOLDER) {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://pus.practicapp.net').replace(/\/$/, '');
    return `${apiBase}/mail/unsubscribe?token=onizleme`;
  }
  return unsubscribeUrl;
}

export default function FooterBlock({ block }: { block: FooterBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);
  const linkHref = resolveFooterLinkHref(block.content.unsubscribeUrl);

  return (
    <BlockFrame id={block.id} label="Footer" backgroundColor={block.style.bg}>
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
        <div className="mt-3 text-center">
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) =>
              updateBlock(block.id, (current) =>
                current.type === 'footer'
                  ? {
                      ...current,
                      content: {
                        ...current.content,
                        unsubscribeText: event.currentTarget.textContent?.trim() || 'Abonelikten çık',
                      },
                    }
                  : current,
              )
            }
            className="inline-block w-auto max-w-full cursor-pointer outline-none"
            style={{
              display: 'inline-block',
              width: 'auto',
              maxWidth: '100%',
              background: block.style.linkColor,
              color: '#ffffff',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 700,
              lineHeight: 1.3,
              boxSizing: 'border-box',
            }}
          >
            {block.content.unsubscribeText}
          </a>
        </div>
      </div>
    </BlockFrame>
  );
}
