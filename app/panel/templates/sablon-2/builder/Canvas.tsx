'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TemplateBlock } from './types';
import { useTemplate2Store } from './store';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import GalleryBlock from './blocks/GalleryBlock';
import ButtonBlock from './blocks/ButtonBlock';
import CouponBlock from './blocks/CouponBlock';
import FooterBlock from './blocks/FooterBlock';
import ProductBlock from './blocks/ProductBlock';
import SocialBlock from './blocks/SocialBlock';
import HeroBlock from './blocks/HeroBlock';
import DividerBlock from './blocks/DividerBlock';
import SpacerBlock from './blocks/SpacerBlock';
import ColumnsBlock from './blocks/ColumnsBlock';

function renderBlock(block: TemplateBlock) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    case 'hero':
      return <HeroBlock block={block} />;
    case 'button':
      return <ButtonBlock block={block} />;
    case 'coupon':
      return <CouponBlock block={block} />;
    case 'footer':
      return <FooterBlock block={block} />;
    case 'product':
      return <ProductBlock block={block} />;
    case 'social':
      return <SocialBlock block={block} />;
    case 'divider':
      return <DividerBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    case 'columns':
      return <ColumnsBlock block={block} />;
  }
}

export default function Canvas() {
  const design = useTemplate2Store((state) => state.design);
  const deviceMode = useTemplate2Store((state) => state.deviceMode);
  const selectBlock = useTemplate2Store((state) => state.selectBlock);
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });
  const isMobile = deviceMode === 'mobile';

  return (
    <div className={`h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-100 ${isMobile ? 'p-2 pb-24' : 'p-6 pb-36'}`}>
      <div
        ref={setNodeRef}
        onClick={() => selectBlock(null)}
        className={`mx-auto rounded-3xl shadow-sm transition-all ${
          isOver ? 'ring-4 ring-emerald-200' : ''
        } ${isMobile ? 'min-h-[720px] p-2 pb-24' : 'min-h-[1080px] p-4 pb-36'}`}
        style={{
          width: `${design.settings.contentWidth}px`,
          maxWidth: '100%',
          backgroundColor: design.settings.bgColor,
          backgroundImage: design.settings.bgImage ? `url(${design.settings.bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div
          className="mx-auto min-h-[900px] overflow-hidden rounded-2xl shadow-xl"
          style={{
            backgroundColor: design.settings.contentBgColor,
            fontFamily: design.settings.fontFamily,
          }}
        >
          {design.blocks.length ? (
            <SortableContext items={design.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1 p-2 pb-28">{design.blocks.map((block) => <div key={block.id}>{renderBlock(block)}</div>)}</div>
            </SortableContext>
          ) : (
            <div className="flex min-h-[900px] items-center justify-center p-10 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">Blok sürükleyerek başlayın</div>
                <p className="mt-2 text-sm text-gray-500">Sol panelden metin, görsel, hero veya buton ekleyin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
