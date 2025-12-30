'use client';

import { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import './grapesjs-theme.css';

interface TemplateEditorProps {
  initialHtml?: string;
  initialCss?: string;
  initialGjsData?: any;
  onSave: (data: { html: string; css: string; gjsData: any }) => void;
  saving?: boolean;
}

export default function TemplateEditor({
  initialHtml = '',
  initialCss = '',
  initialGjsData,
  onSave,
  saving = false,
}: TemplateEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeTab, setActiveTab] = useState<'styles' | 'layers'>('styles');

  useEffect(() => {
    if (!editorRef.current) return;

    const gjs = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      panels: { defaults: [] },
      canvasCss: `
        * { box-sizing: border-box; }
        body { margin: 0; }
      `,
      assetManager: {
        embedAsBase64: true,
        upload: false,
        dropzone: true,
        uploadFile: (e: any) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          
          Array.from(files as FileList).forEach((file: any) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              gjs.AssetManager.add({
                src: base64,
                type: 'image',
                name: file.name,
              });
              const assetManager = gjs.AssetManager;
              const assets = assetManager.getAll();
              if (assets.length > 0) {
                const lastAsset = assets.at(-1);
                if (lastAsset) {
                  assetManager.close();
                }
              }
            };
            reader.readAsDataURL(file);
          });
        },
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '992px' },
          { name: 'Mobile', width: '320px', widthMedia: '480px' },
        ],
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Bölüm</div>',
            category: 'Temel',
            content: '<section style="padding: 50px 20px; min-height: 100px;"><h2>Başlık</h2><p>İçerik buraya gelecek...</p></section>',
          },
          {
            id: 'text',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><div class="gjs-block-label">Metin</div>',
            category: 'Temel',
            content: '<p style="padding: 10px;">Metin içeriği buraya yazın...</p>',
          },
          {
            id: 'heading',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><text x="4" y="18" font-size="16" font-weight="bold" fill="currentColor">H</text></svg><div class="gjs-block-label">Başlık</div>',
            category: 'Temel',
            content: '<h1 style="padding: 10px; font-size: 28px; font-weight: bold;">Başlık</h1>',
          },
          {
            id: 'image',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Görsel</div>',
            category: 'Temel',
            content: { type: 'image' },
          },
          {
            id: 'link-image',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Linkli Görsel</div>',
            category: 'Temel',
            content: { type: 'link-image' },
          },
          {
            id: 'button',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Buton</div>',
            category: 'Temel',
            content: '<a href="#" style="display: inline-block; padding: 12px 24px; background: #2b2973; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Tıkla</a>',
          },
          {
            id: 'divider',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Ayırıcı</div>',
            category: 'Temel',
            content: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />',
          },
          {
            id: 'link',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Link</div>',
            category: 'Temel',
            content: '<a href="#" style="color: #2b2973; text-decoration: underline;">Buraya tıklayın</a>',
          },
          // DÜZEN BLOKLARI
          {
            id: 'flex-row',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="6" width="6" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="6" width="6" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="6" width="6" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Flex Row</div>',
            category: 'Düzen',
            content: '<div style="display: flex; flex-direction: row; gap: 10px; padding: 10px;"><div style="flex: 1; padding: 20px; background: #f3f4f6; min-height: 50px;">1</div><div style="flex: 1; padding: 20px; background: #f3f4f6; min-height: 50px;">2</div></div>',
          },
          {
            id: 'flex-column',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="9" width="16" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="16" width="16" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Flex Column</div>',
            category: 'Düzen',
            content: '<div style="display: flex; flex-direction: column; gap: 10px; padding: 10px;"><div style="padding: 20px; background: #f3f4f6;">Satır 1</div><div style="padding: 20px; background: #f3f4f6;">Satır 2</div></div>',
          },
          {
            id: 'grid-2',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="13" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="13" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Grid 2x2</div>',
            category: 'Düzen',
            content: '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 10px;"><div style="padding: 20px; background: #f3f4f6; text-align: center;">1</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">2</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">3</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">4</div></div>',
          },
          {
            id: 'grid-3',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="3" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="3" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="13" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="13" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="13" width="6" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Grid 3x2</div>',
            category: 'Düzen',
            content: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 10px;"><div style="padding: 20px; background: #f3f4f6; text-align: center;">1</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">2</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">3</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">4</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">5</div><div style="padding: 20px; background: #f3f4f6; text-align: center;">6</div></div>',
          },
          {
            id: 'grid-4',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="3" width="4" height="8" fill="none" stroke="currentColor" stroke-width="1"/><rect x="7" y="3" width="4" height="8" fill="none" stroke="currentColor" stroke-width="1"/><rect x="12" y="3" width="4" height="8" fill="none" stroke="currentColor" stroke-width="1"/><rect x="17" y="3" width="4" height="8" fill="none" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Grid 4 Sütun</div>',
            category: 'Düzen',
            content: '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 10px;"><div style="padding: 15px; background: #f3f4f6; text-align: center;">1</div><div style="padding: 15px; background: #f3f4f6; text-align: center;">2</div><div style="padding: 15px; background: #f3f4f6; text-align: center;">3</div><div style="padding: 15px; background: #f3f4f6; text-align: center;">4</div></div>',
          },
          {
            id: 'two-columns',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">2 Sütun</div>',
            category: 'Düzen',
            content: '<div style="display: flex; gap: 20px;"><div style="flex: 1; padding: 20px; background: #f9fafb;">Sol Sütun</div><div style="flex: 1; padding: 20px; background: #f9fafb;">Sağ Sütun</div></div>',
          },
          {
            id: 'three-columns',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">3 Sütun</div>',
            category: 'Düzen',
            content: '<div style="display: flex; gap: 20px;"><div style="flex: 1; padding: 20px; background: #f9fafb;">1</div><div style="flex: 1; padding: 20px; background: #f9fafb;">2</div><div style="flex: 1; padding: 20px; background: #f9fafb;">3</div></div>',
          },
          {
            id: 'sidebar-layout',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="3" width="11" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Sidebar</div>',
            category: 'Düzen',
            content: '<div style="display: flex; gap: 20px;"><div style="width: 200px; padding: 20px; background: #f3f4f6;">Sidebar</div><div style="flex: 1; padding: 20px; background: #f9fafb;">Ana İçerik</div></div>',
          },
          {
            id: 'container',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2"/></svg><div class="gjs-block-label">Container</div>',
            category: 'Düzen',
            content: '<div style="max-width: 1200px; margin: 0 auto; padding: 20px;"></div>',
          },
          // MAIL BLOKLARI
          {
            id: 'promo-banner',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><div class="gjs-block-label">Promosyon</div>',
            category: 'Mail',
            content: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px;">
              <h2 style="color: white; font-size: 28px; margin-bottom: 10px;">Özel Kampanya!</h2>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-bottom: 20px;">Bu fırsatı kaçırmayın</p>
              <a href="#" style="display: inline-block; padding: 14px 32px; background: white; color: #764ba2; text-decoration: none; border-radius: 8px; font-weight: 600;">İncele</a>
            </div>`,
          },
          {
            id: 'hero-section',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Hero</div>',
            category: 'Mail',
            content: `<div style="background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); padding: 60px 20px; text-align: center;">
              <img src="https://via.placeholder.com/150" alt="Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;"/>
              <h1 style="color: white; font-size: 36px; margin-bottom: 15px;">Hoş Geldiniz!</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 18px; max-width: 500px; margin: 0 auto 25px;">En iyi deneyimi yaşamak için hemen keşfedin</p>
              <a href="#" style="display: inline-block; padding: 16px 40px; background: #e94560; color: white; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px;">Başlayın</a>
            </div>`,
          },
          {
            id: 'product-card',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="5" width="14" height="8" fill="none" stroke="currentColor" stroke-width="1"/><line x1="5" y1="16" x2="19" y2="16" stroke="currentColor" stroke-width="1"/><line x1="5" y1="19" x2="12" y2="19" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Ürün Kartı</div>',
            category: 'Mail',
            content: `<div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 300px;">
              <a href="#" style="display: block;"><img src="https://via.placeholder.com/300x200" alt="Ürün" style="width: 100%; height: auto; display: block;"/></a>
              <div style="padding: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 8px; color: #333;">Ürün Adı</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Kısa açıklama metni</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 20px; font-weight: bold; color: #2b2973;">₺199</span>
                  <a href="#" style="padding: 10px 20px; background: #2b2973; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">Satın Al</a>
                </div>
              </div>
            </div>`,
          },
          {
            id: 'footer',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><rect x="3" y="15" width="18" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Footer</div>',
            category: 'Mail',
            content: `<footer style="background: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">© 2024 Şirket Adı. Tüm hakları saklıdır.</p>
              <p style="color: #9ca3af; font-size: 12px;">Bu e-postayı almak istemiyorsanız <a href="#" style="color: #6b7280;">abonelikten çıkın</a>.</p>
            </footer>`,
          },
          {
            id: 'social-icons',
            label: '<svg class="w-8 h-8" viewBox="0 0 24 24"><circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Sosyal</div>',
            category: 'Mail',
            content: `<div style="text-align: center; padding: 20px;">
              <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #1877f2; border-radius: 50%; margin: 0 5px; line-height: 40px; color: white; text-decoration: none;">f</a>
              <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #1da1f2; border-radius: 50%; margin: 0 5px; line-height: 40px; color: white; text-decoration: none;">t</a>
              <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #e4405f; border-radius: 50%; margin: 0 5px; line-height: 40px; color: white; text-decoration: none;">i</a>
            </div>`,
          },
        ],
      },
      styleManager: {
        appendTo: '#styles',
        sectors: [
          {
            name: 'Boyut',
            open: true,
            properties: ['width', 'height', 'max-width', 'min-width', 'min-height', 'max-height', 'margin', 'padding'],
          },
          {
            name: 'Flex / Grid',
            open: false,
            properties: [
              { name: 'Display', property: 'display', type: 'select', defaults: 'block', options: [
                { value: 'block', name: 'Block' },
                { value: 'inline-block', name: 'Inline Block' },
                { value: 'flex', name: 'Flex' },
                { value: 'grid', name: 'Grid' },
                { value: 'inline-flex', name: 'Inline Flex' },
                { value: 'none', name: 'None' },
              ]},
              { name: 'Flex Direction', property: 'flex-direction', type: 'select', defaults: 'row', options: [
                { value: 'row', name: 'Row →' },
                { value: 'row-reverse', name: 'Row Reverse ←' },
                { value: 'column', name: 'Column ↓' },
                { value: 'column-reverse', name: 'Column Reverse ↑' },
              ]},
              { name: 'Justify Content', property: 'justify-content', type: 'select', defaults: 'flex-start', options: [
                { value: 'flex-start', name: 'Start' },
                { value: 'flex-end', name: 'End' },
                { value: 'center', name: 'Center' },
                { value: 'space-between', name: 'Space Between' },
                { value: 'space-around', name: 'Space Around' },
                { value: 'space-evenly', name: 'Space Evenly' },
              ]},
              { name: 'Align Items', property: 'align-items', type: 'select', defaults: 'stretch', options: [
                { value: 'flex-start', name: 'Start' },
                { value: 'flex-end', name: 'End' },
                { value: 'center', name: 'Center' },
                { value: 'stretch', name: 'Stretch' },
                { value: 'baseline', name: 'Baseline' },
              ]},
              { name: 'Flex Wrap', property: 'flex-wrap', type: 'select', defaults: 'nowrap', options: [
                { value: 'nowrap', name: 'No Wrap' },
                { value: 'wrap', name: 'Wrap' },
                { value: 'wrap-reverse', name: 'Wrap Reverse' },
              ]},
              { name: 'Gap', property: 'gap' },
              { name: 'Flex', property: 'flex' },
              { name: 'Grid Columns', property: 'grid-template-columns' },
              { name: 'Grid Rows', property: 'grid-template-rows' },
            ],
          },
          {
            name: 'Tipografi',
            open: false,
            properties: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration'],
          },
          {
            name: 'Dekorasyon',
            open: false,
            properties: ['background-color', 'background', 'background-image', 'border-radius', 'border', 'box-shadow'],
          },
          {
            name: 'Konum',
            open: false,
            properties: [
              { name: 'Position', property: 'position', type: 'select', defaults: 'static', options: [
                { value: 'static', name: 'Static'  },
                { value: 'relative', name: 'Relative' },
                { value: 'absolute', name: 'Absolute' },
                { value: 'fixed', name: 'Fixed' },
              ]},
              'top', 'right', 'bottom', 'left', 'z-index'
            ],
          },
          {
            name: 'Ekstra',
            open: false,
            properties: ['opacity', 'overflow', 'cursor', 'transition'],
          },
        ],
      },
      layerManager: {
        appendTo: '#layers',
      },
      traitManager: {
        appendTo: '#traits',
      },
    });

    // Image component'e link trait'i ekle
    gjs.DomComponents.addType('image', {
      model: {
        defaults: {
          traits: [
            {
              type: 'text',
              name: 'src',
              label: 'Görsel URL',
            },
            {
              type: 'text',
              name: 'alt',
              label: 'Alt Metin',
            },
            {
              type: 'text',
              name: 'title',
              label: 'Başlık',
            },
            {
              type: 'text',
              name: 'data-link',
              label: 'Link URL (Tıklanabilir)',
              placeholder: 'https://example.com',
            },
            {
              type: 'select',
              name: 'data-link-target',
              label: 'Link Açılış',
              options: [
                { value: '_blank', name: 'Yeni Sekme' },
                { value: '_self', name: 'Aynı Sayfa' },
              ],
            },
          ],
        },
      },
    });

    // Linkli Görsel component type
    gjs.DomComponents.addType('link-image', {
      extend: 'link',
      model: {
        defaults: {
          tagName: 'a',
          droppable: false,
          traits: [
            {
              type: 'text',
              name: 'href',
              label: 'Link URL',
              placeholder: 'https://example.com',
            },
            {
              type: 'select',
              name: 'target',
              label: 'Açılış',
              options: [
                { value: '_blank', name: 'Yeni Sekme' },
                { value: '_self', name: 'Aynı Sayfa' },
              ],
            },
          ],
          components: [
            {
              type: 'image',
              attributes: { src: 'https://via.placeholder.com/350x200', alt: 'Görsel' },
              style: { 'max-width': '100%', height: 'auto', display: 'block' },
            },
          ],
        },
      },
    });

    // Link component için trait'ler
    gjs.DomComponents.addType('link', {
      model: {
        defaults: {
          traits: [
            {
              type: 'text',
              name: 'href',
              label: 'Link URL',
            },
            {
              type: 'select',
              name: 'target',
              label: 'Açılış',
              options: [
                { value: '', name: 'Aynı Sayfa' },
                { value: '_blank', name: 'Yeni Sekme' },
              ],
            },
            {
              type: 'text',
              name: 'title',
              label: 'Başlık',
            },
          ],
        },
      },
    });

    // Load initial content
    if (initialGjsData) {
      gjs.loadProjectData(initialGjsData);
    } else if (initialHtml) {
      gjs.setComponents(initialHtml);
      if (initialCss) {
        gjs.setStyle(initialCss);
      }
    }

    // Varsayılan olarak tablet görünümünde aç
    gjs.setDevice('Tablet');

    setEditor(gjs);

    return () => {
      gjs.destroy();
    };
  }, []);

  const handleSave = () => {
    if (!editor) return;

    const rawHtml = editor.getHtml();
    const css = editor.getCss();
    const gjsData = editor.getProjectData();

    const html = css 
      ? `<style>${css}</style>${rawHtml}` 
      : rawHtml;

    onSave({ html, css: css || '', gjsData });
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* Left Panel - Blocks */}
      <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bloklar</h3>
        </div>
        <div id="blocks" className="flex-1 overflow-y-auto"></div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor?.runCommand('core:undo')}
              className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Geri Al"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={() => editor?.runCommand('core:redo')}
              className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Yinele"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
            <div className="w-px h-5 bg-gray-200 mx-2"></div>
            <button
              onClick={() => editor?.setDevice('Desktop')}
              className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Masaüstü"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => editor?.setDevice('Tablet')}
              className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Tablet"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => editor?.setDevice('Mobile')}
              className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Mobil"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Kaydet
              </>
            )}
          </button>
        </div>
        {/* Canvas */}
        <div ref={editorRef} className="flex-1"></div>
      </div>

      {/* Right Panel - Styles, Layers & Traits */}
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        {/* Tabs */}
        <div className="flex p-2 gap-1 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('styles')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'styles' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Stiller
          </button>
          <button 
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'layers' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Katmanlar
          </button>
        </div>
        <div id="styles" className={`flex-1 overflow-y-auto ${activeTab === 'styles' ? '' : 'hidden'}`}></div>
        <div id="layers" className={`flex-1 overflow-y-auto ${activeTab === 'layers' ? '' : 'hidden'}`}></div>
        {/* Traits */}
        <div className="border-t border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Özellikler</h4>
          </div>
          <div id="traits" className="p-2 max-h-48 overflow-y-auto"></div>
        </div>
      </div>
    </div>
  );
}
