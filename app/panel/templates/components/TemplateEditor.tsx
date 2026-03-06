'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import './grapesjs-theme.css';
import ImageCropModal from './ImageCropModal';
import EditorToolbar from './EditorToolbar';
import SpacingPanel, { type SpacingInfo } from './SpacingPanel';
import { editorBlocks } from './editorBlocks';
import { editorStyleSectors } from './editorStyleSectors';
import { editorCanvasCss } from './editorCanvasCss';
import { inlineCssIntoHtml } from './emailUtils';
import {
  registerSpacingSliderTrait,
  registerImageComponent,
  registerTableComponents,
  registerLinkComponents,
  registerRteActions,
  getResolvedStyle,
  migrateCssRulesToInline,
} from './registerEditorComponents';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const UPLOAD_BASE = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || API_URL;
const GRID = 5;

const snap = (val: string): string => {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  return `${Math.round(n / GRID) * GRID}px`;
};

interface TemplateEditorProps {
  initialHtml?: string;
  initialCss?: string;
  initialGjsData?: any;
  onSave: (data: { html: string; css: string; gjsData: any }) => void;
  saving?: boolean;
}

type RightTab = 'styles' | 'layers' | 'traits';

export default function TemplateEditor({
  initialHtml = '',
  initialCss = '',
  initialGjsData,
  onSave,
  saving = false,
}: TemplateEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeTab, setActiveTab] = useState<RightTab>('styles');
  const [blockSearch, setBlockSearch] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const cropTargetRef = useRef<any>(null);
  const [activeDevice, setActiveDevice] = useState<'Desktop' | 'Tablet' | 'Mobile'>('Desktop');
  const [showGrid, setShowGrid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spacingInfo, setSpacingInfo] = useState<SpacingInfo | null>(null);
  const selectedCompRef = useRef<any>(null);

  // Block search filter
  useEffect(() => {
    if (!editor) return;
    const allBlocks = editor.BlockManager.getAll();
    allBlocks.forEach((block: any) => {
      const el = block.view?.el as HTMLElement | undefined;
      if (!el) return;
      const label = (block.getLabel?.() || '').toLowerCase().replace(/<[^>]*>/g, '');
      const cat = String(block.get?.('category') || '').toLowerCase();
      const q = blockSearch.toLowerCase();
      const matches = !q || label.includes(q) || cat.includes(q);
      el.style.display = matches ? '' : 'none';
    });
  }, [blockSearch, editor]);

  // Grid toggle
  useEffect(() => {
    if (!editor) return;
    const canvas = editor.Canvas;
    const frame = canvas.getFrames()[0];
    if (!frame) return;
    try {
      const doc = (frame as any).view?.getBody?.()?.ownerDocument;
      if (!doc) return;
      const htmlEl = doc.documentElement;
      if (showGrid) {
        htmlEl.style.backgroundImage =
          'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)';
        htmlEl.style.backgroundSize = '5px 5px';
      } else {
        htmlEl.style.backgroundImage = '';
        htmlEl.style.backgroundSize = '';
      }
    } catch {}
  }, [showGrid, editor]);

  // ── GrapesJS init ──
  useEffect(() => {
    if (!editorRef.current) return;

    const gjs = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      avoidInlineStyle: false,
      panels: { defaults: [] },
      canvasCss: editorCanvasCss,
      assetManager: {
        embedAsBase64: false,
        upload: false,
        dropzone: true,
        uploadFile: async (e: any) => {
          const files: FileList = e.dataTransfer ? e.dataTransfer.files : e.target?.files;
          if (!files?.length) return;
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

          for (const f of Array.from(files as FileList)) {
            const formData = new FormData();
            formData.append('file', f as Blob);
            try {
              const res = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
              });
              if (!res.ok) continue;
              const data = await res.json();
              if (data.url) {
                const imgUrl = data.url.startsWith('http') ? data.url : `${UPLOAD_BASE}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
                gjs.AssetManager.add({ src: imgUrl, type: 'image', name: (f as File).name });
              }
            } catch (err) {
              console.error('Görsel yükleme hatası:', err);
            }
          }
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
        blocks: editorBlocks,
      },
      styleManager: {
        appendTo: '#styles',
        sectors: editorStyleSectors,
      },
      layerManager: { appendTo: '#layers' },
      traitManager: { appendTo: '#traits' },
    });

    // ── Register custom traits & components ──
    registerSpacingSliderTrait(gjs);
    registerImageComponent(gjs, setCropFile, cropTargetRef);
    registerTableComponents(gjs);
    registerLinkComponents(gjs);
    registerRteActions(gjs);

    // ── Renk paleti (sp-container) viewport dışına çıkmasın ──
    const repositionColorPicker = () => {
      const containers = document.querySelectorAll('.sp-container:not(.sp-hidden)');
      containers.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 10) {
          const overflow = rect.bottom - window.innerHeight + 16;
          htmlEl.style.top = `${parseInt(htmlEl.style.top || '0') - overflow}px`;
        }
        if (rect.top < 10) {
          htmlEl.style.top = '10px';
        }
        if (rect.right > window.innerWidth - 10) {
          const overflow = rect.right - window.innerWidth + 16;
          htmlEl.style.left = `${parseInt(htmlEl.style.left || '0') - overflow}px`;
        }
        if (rect.left < 10) {
          htmlEl.style.left = '10px';
        }
      });
    };
    const colorPickerObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const el = m.target as HTMLElement;
        if (!el.classList?.contains('sp-container')) continue;
        if (el.classList.contains('sp-hidden')) continue;
        requestAnimationFrame(repositionColorPicker);
      }
    });
    colorPickerObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style'],
    });

    // ── Wrapper ayarla ──
    gjs.on('load', () => {
      try {
        const wrapper = gjs.getWrapper();
        if (wrapper) {
          wrapper.set({
            removable: false,
            copyable: false,
            draggable: false,
            highlightable: true,
            selectable: true,
            resizable: false,
            stylable: true,
          });
          const wrapperStyle = wrapper.getStyle();
          if (!wrapperStyle['background-color'] && !wrapperStyle['background']) {
            wrapper.addStyle({ 'background-color': '#ffffff' });
          }
        }
      } catch {}
      setTimeout(() => migrateCssRulesToInline(gjs), 100);
    });

    // ── Tüm component'lere resize handle + spacing trait'leri ekle ──
    gjs.on('component:selected', (component: any) => {
      if ((component as any).is?.('wrapper')) {
        setSpacingInfo(null);
        selectedCompRef.current = null;
        return;
      }
      if (!component.get('resizable')) {
        component.set('resizable', {
          tl: true, tr: true, bl: true, br: true,
          tc: true, bc: true, cl: true, cr: true,
          step: GRID,
          minDim: 10,
        });
      }
      const traits = component.get('traits');
      const hasSpacing = traits?.where?.({ name: 'data-mt' })?.length > 0;
      if (!hasSpacing) {
        const style = getResolvedStyle(component);
        const spacingTraits = [
          { type: 'spacing-slider', name: 'data-mt', label: '↕ Üst Uzaklık', changeProp: true },
          { type: 'spacing-slider', name: 'data-mb', label: '↕ Alt Uzaklık', changeProp: true },
          { type: 'spacing-slider', name: 'data-pt', label: '⬜ İç Üst', changeProp: true },
          { type: 'spacing-slider', name: 'data-pb', label: '⬜ İç Alt', changeProp: true },
          { type: 'spacing-slider', name: 'data-pl', label: '⬜ İç Sol', changeProp: true },
          { type: 'spacing-slider', name: 'data-pr', label: '⬜ İç Sağ', changeProp: true },
        ];
        spacingTraits.forEach(t => {
          if (!traits?.where?.({ name: t.name })?.length) {
            component.addTrait(t);
          }
        });
        const cssMap: Record<string, string> = {
          'data-mt': 'margin-top',
          'data-mb': 'margin-bottom',
          'data-pt': 'padding-top',
          'data-pb': 'padding-bottom',
          'data-pl': 'padding-left',
          'data-pr': 'padding-right',
        };
        Object.entries(cssMap).forEach(([prop, cssProp]) => {
          const val = parseInt(style[cssProp]) || 0;
          if (val) component.set(prop, val);
        });
        Object.entries(cssMap).forEach(([prop, cssProp]) => {
          component.on(`change:${prop}`, () => {
            const val = component.get(prop);
            component.addStyle({ [cssProp]: val ? `${val}px` : '0px' });
          });
        });
      }

      const parent = component.parent();
      if (parent) {
        const siblings = parent.components()?.models || [];
        const idx = siblings.indexOf(component);
        const prev = idx > 0 ? siblings[idx - 1] : null;
        const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;
        const resolved = getResolvedStyle(component);
        setSpacingInfo({
          mt: parseInt(resolved['margin-top']) || 0,
          mb: parseInt(resolved['margin-bottom']) || 0,
          ml: parseInt(resolved['margin-left']) || 0,
          mr: parseInt(resolved['margin-right']) || 0,
          prevName: prev ? (prev.getName?.() || prev.get('tagName') || 'Element') : '',
          nextName: next ? (next.getName?.() || next.get('tagName') || 'Element') : '',
          selectedName: component.getName?.() || component.get('tagName') || 'Element',
        });
        selectedCompRef.current = component;
      }
    });

    gjs.on('component:deselected', () => {
      setSpacingInfo(null);
      selectedCompRef.current = null;
    });

    // ── Yeni eklenen component 600px'e sığsın + td padding sıfırla ──
    gjs.on('component:add', (component: any) => {
      const type = component.get?.('type') || '';
      if (type === 'wrapper' || type === 'textnode' || type === 'comment') return;
      const parent = component.parent?.();
      if (!parent) return;
      const parentType = parent.get?.('type') || '';
      if (parentType === 'wrapper') {
        const style = component.getStyle();
        if (!style.width) {
          component.addStyle({ width: '100%' });
        }
      }
      if (parentType === 'cell') {
        parent.addStyle({
          'padding': '0',
          'padding-top': '0',
          'padding-bottom': '0',
          'padding-left': '0',
          'padding-right': '0',
        });
        ['data-cell-pt', 'data-cell-pb', 'data-cell-pl', 'data-cell-pr'].forEach(p => {
          try { parent.set(p, 0); } catch {}
        });
      }
    });

    // ── Snap to Grid: Resize bitti ──
    gjs.on('component:resize', ({ target }: any) => {
      if (!target) return;
      const style = target.getStyle();
      const upd: Record<string, string> = {};
      ['width', 'height', 'min-height'].forEach((p) => {
        if (style[p] && style[p] !== 'auto') {
          const val = parseFloat(style[p]);
          if (isNaN(val)) return;
          upd[p] = `${Math.round(val / GRID) * GRID}px`;
        }
      });
      if (Object.keys(upd).length) target.addStyle(upd);
    });

    // ── Snap to Grid: Style manager değişikliği ──
    const snapProps = new Set([
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'gap', 'row-gap', 'column-gap',
      'width', 'height', 'min-height', 'min-width', 'max-width',
      'top', 'left', 'right', 'bottom',
    ]);

    gjs.on('styleManager:change', ({ property }: any) => {
      try {
        const name = property?.getName?.();
        if (!name || !snapProps.has(name)) return;
        const val = String(property.getValue?.() ?? '');
        if (!val || val === 'auto' || val === 'none') return;
        const snapped = snap(val);
        if (snapped !== val) property.setValue?.(snapped);
      } catch {}
    });

    // ── Initial content yükleme ──
    if (initialGjsData) {
      gjs.loadProjectData(initialGjsData);
    } else if (initialHtml) {
      const isFullHtml = initialHtml.trim().startsWith('<!DOCTYPE') || initialHtml.trim().toLowerCase().startsWith('<html');
      if (isFullHtml) {
        const bodyMatch = initialHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const styleMatches = [...initialHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';
        const mainStyle = styleMatches.length > 1
          ? styleMatches[styleMatches.length - 1][1].trim()
          : styleMatches.length === 1 ? styleMatches[0][1].trim() : '';
        gjs.setComponents(bodyContent);
        if (mainStyle) gjs.setStyle(mainStyle);
      } else {
        gjs.setComponents(initialHtml);
        if (initialCss) gjs.setStyle(initialCss);
      }
    }

    gjs.setDevice('Desktop');

    setEditor(gjs);

    return () => { colorPickerObserver.disconnect(); gjs.destroy(); };
  }, []);

  // ── Handlers ──

  const handleSave = useCallback(() => {
    if (!editor) return;
    const rawHtml = editor.getHtml();
    const css = (editor.getCss() || '').replace(/\*\s*\{[^}]*box-sizing[^}]*\}/gi, '').trim();
    const gjsData = editor.getProjectData();
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyRaw = bodyMatch ? bodyMatch[1] : rawHtml;

    const wrapper = editor.getWrapper();
    const wrapperStyle = wrapper?.getStyle() || {};
    const bodyBg = wrapperStyle['background-color'] || wrapperStyle['background'] || '#ffffff';

    const bodyContent = inlineCssIntoHtml(bodyRaw, css);

    const fullHtml = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title></title>
  <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body { width: 600px !important; margin: 0 auto !important; }
    table { border-collapse: collapse; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; }
  </style>
  <![endif]-->
  <style type="text/css">
body {
  margin: 0;
  padding: 0;
  background-color: #e8ecf0;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  font-family: Arial, Helvetica, sans-serif;
}
img { border: 0; outline: none; text-decoration: none; display: block; max-width: 100%; }
table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
div, p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
${css}
  </style>
</head>
<body style="margin:0;padding:0;background-color:#e8ecf0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8ecf0;">
    <tr>
      <td align="center" valign="top" style="padding:0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${bodyBg};margin:0 auto;table-layout:fixed;">
          <tr>
            <td valign="top" style="padding:0;background-color:${bodyBg};overflow:hidden;width:600px;max-width:600px;word-wrap:break-word;">
${bodyContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    onSave({ html: fullHtml, css: '', gjsData });
  }, [editor, onSave]);

  const switchDevice = (device: 'Desktop' | 'Tablet' | 'Mobile') => {
    editor?.setDevice(device);
    setActiveDevice(device);
  };

  const handleTextAlign = (align: string) => {
    const sel = editor?.getSelected();
    if (sel) sel.addStyle({ 'text-align': align });
  };

  const handleMoveUp = () => {
    const sel = editor?.getSelected();
    if (!sel) return;
    const parent = sel.parent();
    if (!parent) return;
    const siblings = parent.components();
    const idx = siblings.indexOf(sel);
    if (idx <= 0) return;
    try {
      sel.move(parent, { at: idx - 1 });
    } catch {
      const clone = sel.clone();
      sel.remove();
      parent.components().add(clone, { at: idx - 1 });
      editor?.select(clone);
    }
  };

  const handleMoveDown = () => {
    const sel = editor?.getSelected();
    if (!sel) return;
    const parent = sel.parent();
    if (!parent) return;
    const siblings = parent.components();
    const idx = siblings.indexOf(sel);
    if (idx >= siblings.length - 1) return;
    try {
      sel.move(parent, { at: idx + 2 });
    } catch {
      const clone = sel.clone();
      sel.remove();
      parent.components().add(clone, { at: idx + 1 });
      editor?.select(clone);
    }
  };

  const handlePreview = () => {
    if (!editor) return;
    const rawHtml = editor.getHtml();
    const css = (editor.getCss() || '').replace(/\*\s*\{[^}]*box-sizing[^}]*\}/gi, '').trim();
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyRaw = bodyMatch ? bodyMatch[1] : rawHtml;
    const inlined = inlineCssIntoHtml(bodyRaw, css);

    const wrapper = editor.getWrapper();
    const wrapperStyle = wrapper?.getStyle() || {};
    const bodyBg = wrapperStyle['background-color'] || wrapperStyle['background'] || '#ffffff';

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:#e8ecf0;font-family:Arial,Helvetica,sans-serif;}img{border:0;display:block;max-width:100%;}table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}div,p,h1,h2,h3,h4,h5,h6{margin:0;padding:0;}${css}</style></head><body style="margin:0;padding:0;background:#e8ecf0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8ecf0;"><tr><td align="center" valign="top"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${bodyBg};table-layout:fixed;"><tr><td valign="top" style="background-color:${bodyBg};overflow:hidden;width:600px;max-width:600px;word-wrap:break-word;">${inlined}</td></tr></table></td></tr></table></body></html>`);
      win.document.close();
    }
  };

  const updateSpacing = (prop: 'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right', val: number) => {
    const comp = selectedCompRef.current;
    if (!comp) return;
    comp.addStyle({ [prop]: `${val}px` });
    const keyMap: Record<string, string> = { 'margin-top': 'mt', 'margin-bottom': 'mb', 'margin-left': 'ml', 'margin-right': 'mr' };
    setSpacingInfo(prev => prev ? { ...prev, [keyMap[prop]]: val } : null);
  };

  return (
    <>
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onComplete={(url, width, height) => {
            const comp = cropTargetRef.current;
            if (comp) {
              comp.set('src', url);
              comp.addAttributes({ src: url });
              const maxW = 300;
              const ratio = height / width;
              const displayW = Math.min(width, maxW);
              const displayH = Math.round(displayW * ratio);
              comp.addStyle({
                width: `${displayW}px`,
                height: `${displayH}px`,
                display: 'block',
              });
            }
            setCropFile(null);
            cropTargetRef.current = null;
          }}
          onClose={() => {
            setCropFile(null);
            cropTargetRef.current = null;
          }}
        />
      )}

      <div className={`flex bg-gray-50 overflow-hidden shadow-lg border border-gray-200 transition-all ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'h-[calc(100vh-120px)] rounded-2xl'}`}>

        {/* ── Sol Panel ── */}
        <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Blok ara..."
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
              {blockSearch && (
                <button onClick={() => setBlockSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto"></div>
        </div>

        {/* ── Orta Canvas ── */}
        <div className="flex-1 flex flex-col bg-gray-100 min-w-0">
          <EditorToolbar
            editor={editor}
            activeDevice={activeDevice}
            onSwitchDevice={switchDevice}
            onTextAlign={handleTextAlign}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onPreview={handlePreview}
            onSave={handleSave}
            saving={saving}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(g => !g)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(f => !f)}
          />
          <div ref={editorRef} className="flex-1 min-h-0"/>
        </div>

        {/* ── Sağ Panel ── */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
          <div className="flex p-1.5 gap-1 border-b border-gray-200 bg-gray-50">
            {([
              { key: 'styles', label: 'Stiller' },
              { key: 'layers', label: 'Katmanlar' },
              { key: 'traits', label: 'Özellikler' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            id="styles"
            className={`flex-1 overflow-y-auto ${activeTab === 'styles' ? '' : 'hidden'}`}
          />
          <div className={`flex-1 flex flex-col overflow-hidden ${activeTab === 'layers' ? '' : 'hidden'}`}>
            {spacingInfo && (
              <SpacingPanel spacingInfo={spacingInfo} onUpdateSpacing={updateSpacing} />
            )}
            <div id="layers" className="flex-1 overflow-y-auto"/>
          </div>
          <div
            id="traits"
            className={`flex-1 overflow-y-auto p-3 ${activeTab === 'traits' ? '' : 'hidden'}`}
          />
        </div>
      </div>
    </>
  );
}
