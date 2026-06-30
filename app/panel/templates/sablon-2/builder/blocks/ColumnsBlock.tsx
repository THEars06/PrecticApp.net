'use client';

import { ColumnsBlock as ColumnsBlockType, TemplateBlock } from '../types';
import BlockFrame from './BlockFrame';
import HeadingBlock from './HeadingBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import GalleryBlock from './GalleryBlock';
import ButtonBlock from './ButtonBlock';
import CouponBlock from './CouponBlock';
import FooterBlock from './FooterBlock';
import ProductBlock from './ProductBlock';
import SocialBlock from './SocialBlock';
import HeroBlock from './HeroBlock';
import DividerBlock from './DividerBlock';
import SpacerBlock from './SpacerBlock';

function renderNested(block: TemplateBlock) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock key={block.id} block={block} />;
    case 'text':
      return <TextBlock key={block.id} block={block} />;
    case 'image':
      return <ImageBlock key={block.id} block={block} />;
    case 'gallery':
      return <GalleryBlock key={block.id} block={block} />;
    case 'hero':
      return <HeroBlock key={block.id} block={block} />;
    case 'button':
      return <ButtonBlock key={block.id} block={block} />;
    case 'coupon':
      return <CouponBlock key={block.id} block={block} />;
    case 'footer':
      return <FooterBlock key={block.id} block={block} />;
    case 'product':
      return <ProductBlock key={block.id} block={block} />;
    case 'social':
      return <SocialBlock key={block.id} block={block} />;
    case 'divider':
      return <DividerBlock key={block.id} block={block} />;
    case 'spacer':
      return <SpacerBlock key={block.id} block={block} />;
    case 'columns':
      return <ColumnsBlock key={block.id} block={block} />;
  }
}

export default function ColumnsBlock({ block }: { block: ColumnsBlockType }) {
  return (
    <BlockFrame id={block.id} label="2 Kolon">
      <div
        className="grid grid-cols-2 gap-3 px-6 py-4"
        style={{ gap: block.style.gap, padding: block.style.padding }}
      >
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-2">
          {block.content.left.map(renderNested)}
        </div>
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-2">
          {block.content.right.map(renderNested)}
        </div>
      </div>
    </BlockFrame>
  );
}
