'use client';

import { SocialBlock as SocialBlockType, SocialLink, SocialPlatform } from '../types';
import { useTemplate2Store } from '../store';
import BlockFrame from './BlockFrame';

function getSocialPlatform(link: SocialLink): SocialPlatform {
  const value = `${link.platform || ''} ${link.label || ''} ${link.url || ''}`.toLowerCase();
  if (value.includes('instagram')) return 'instagram';
  if (value.includes('facebook') || value.includes('fb.com')) return 'facebook';
  if (value.includes('twitter') || value.includes('x.com') || value.trim() === 'x') return 'x';
  if (value.includes('linkedin')) return 'linkedin';
  return 'website';
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.5" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (platform === 'facebook') {
    return <span className="font-sans text-xl font-black leading-none">f</span>;
  }

  if (platform === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (platform === 'linkedin') {
    return <span className="font-sans text-sm font-black leading-none">in</span>;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M10.5 13.5a4 4 0 0 0 5.7 0l2.1-2.1a4 4 0 0 0-5.7-5.7l-1.2 1.2M13.5 10.5a4 4 0 0 0-5.7 0l-2.1 2.1a4 4 0 0 0 5.7 5.7l1.2-1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SocialBlock({ block }: { block: SocialBlockType }) {
  const updateBlock = useTemplate2Store((state) => state.updateBlock);

  return (
    <BlockFrame id={block.id} label="Sosyal Linkler" backgroundColor={block.style.bg}>
      <div
        style={{
          background: block.style.bg,
          borderRadius: block.style.borderRadius,
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
              current.type === 'social' ? { ...current, content: { ...current.content, title: event.currentTarget.textContent || '' } } : current,
            )
          }
          className="font-bold outline-none"
        >
          {block.content.title}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {block.content.links.map((link) => (
            <a
              key={link.id}
              href={link.url || '#'}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: block.style.linkBg, color: block.style.linkColor }}
            >
              <SocialIcon platform={getSocialPlatform(link)} />
            </a>
          ))}
        </div>
      </div>
    </BlockFrame>
  );
}
