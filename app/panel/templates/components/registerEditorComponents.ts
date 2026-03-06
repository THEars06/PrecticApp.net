import type { Editor } from 'grapesjs';

const GRID = 5;

export function registerSpacingSliderTrait(gjs: Editor) {
  gjs.Traits.addType('spacing-slider', {
    eventCapture: ['input input[type="range"]', 'change input[type="number"]'],

    createInput({ trait }: any) {
      const val = trait.get('value') || 0;
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;width:100%;';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '80';
      slider.step = String(GRID);
      slider.value = String(val);
      slider.style.cssText = 'flex:1;height:5px;accent-color:#3b82f6;cursor:grab;';

      const num = document.createElement('input');
      num.type = 'number';
      num.min = '0';
      num.max = '200';
      num.step = '1';
      num.value = String(val);
      num.style.cssText = 'width:48px;text-align:center;font-size:11px;border:1px solid #e2e8f0;border-radius:4px;padding:2px;color:#475569;background:#f8fafc;';

      const unit = document.createElement('span');
      unit.textContent = 'px';
      unit.style.cssText = 'font-size:10px;color:#94a3b8;';

      slider.addEventListener('input', () => { num.value = slider.value; });
      num.addEventListener('input', () => { slider.value = num.value; });

      wrapper.appendChild(slider);
      wrapper.appendChild(num);
      wrapper.appendChild(unit);
      return wrapper;
    },

    onEvent({ elInput }: any) {
      const slider = elInput.querySelector('input[type="range"]');
      const num = elInput.querySelector('input[type="number"]');
      return Number(num?.value || slider?.value || 0);
    },

    onUpdate({ elInput, trait }: any) {
      const slider = elInput.querySelector('input[type="range"]');
      const num = elInput.querySelector('input[type="number"]');
      const v = String(trait.get('value') || 0);
      if (slider) slider.value = v;
      if (num) num.value = v;
    },
  });
}

export function registerImageComponent(
  gjs: Editor,
  setCropFile: (file: File | null) => void,
  cropTargetRef: React.MutableRefObject<any>,
) {
  const uploadImageForComponent = (component: any) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      cropTargetRef.current = component;
      setCropFile(file);
    };
    input.click();
  };

  gjs.Commands.add('upload-image-cmd', {
    run(editor: Editor) {
      const sel = editor.getSelected();
      if (sel) uploadImageForComponent(sel);
    },
  });

  gjs.DomComponents.addType('image', {
    extend: 'image',
    model: {
      defaults: {
        toolbar: [
          { attributes: { class: 'fa fa-arrows' }, command: 'tlb-move' },
          {
            label: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
            command: 'upload-image-cmd',
            attributes: { title: 'Görsel Yükle' },
          },
          { attributes: { class: 'fa fa-clone' }, command: 'tlb-clone' },
          { attributes: { class: 'fa fa-trash-o' }, command: 'tlb-delete' },
        ],
        traits: [
          { type: 'text', name: 'src', label: 'Görsel URL', changeProp: true },
          { type: 'text', name: 'alt', label: 'Alt Metin' },
          { type: 'text', name: 'title', label: 'Başlık' },
          { type: 'text', name: 'data-link', label: 'Link URL', placeholder: 'https://' },
          { type: 'select', name: 'data-link-target', label: 'Link Açılış', options: [
            { id: '_blank', value: '_blank', name: 'Yeni Sekme' },
            { id: '_self', value: '_self', name: 'Aynı Sayfa' },
          ]},
        ],
      },
    },
  });
}

export function registerTableComponents(gjs: Editor) {
  gjs.DomComponents.addType('cell', {
    extend: 'cell',
    model: {
      defaults: {
        highlightable: true,
        selectable: true,
        draggable: 'tr',
        droppable: true,
        stylable: true,
        toolbar: [
          { attributes: { class: 'fa fa-arrows' }, command: 'tlb-move' },
          { attributes: { class: 'fa fa-clone' }, command: 'tlb-clone' },
          { attributes: { class: 'fa fa-trash-o' }, command: 'tlb-delete' },
        ],
        traits: [
          { type: 'spacing-slider', name: 'data-cell-pt', label: 'Üst Boşluk (px)', changeProp: true },
          { type: 'spacing-slider', name: 'data-cell-pb', label: 'Alt Boşluk (px)', changeProp: true },
          { type: 'spacing-slider', name: 'data-cell-pl', label: 'Sol Boşluk (px)', changeProp: true },
          { type: 'spacing-slider', name: 'data-cell-pr', label: 'Sağ Boşluk (px)', changeProp: true },
          { type: 'text', name: 'data-cell-w', label: 'Genişlik (%)', placeholder: '50', changeProp: true },
          { type: 'color', name: 'data-cell-bg', label: 'Arka Plan', changeProp: true },
        ],
      },
      init() {
        const cellCssMap: Record<string, string> = {
          'data-cell-pt': 'padding-top',
          'data-cell-pb': 'padding-bottom',
          'data-cell-pl': 'padding-left',
          'data-cell-pr': 'padding-right',
        };
        const style = this.getStyle() as Record<string, string>;
        Object.entries(cellCssMap).forEach(([prop, cssProp]) => {
          const val = parseInt(String(style[cssProp])) || 0;
          if (val) this.set(prop, val);
        });
        const w = style['width'];
        if (w) this.set('data-cell-w', parseInt(String(w)) || '');
        const bg = style['background-color'] || style['background'];
        if (bg) this.set('data-cell-bg', bg);

        Object.entries(cellCssMap).forEach(([prop, cssProp]) => {
          this.on(`change:${prop}`, () => {
            const val = this.get(prop);
            this.addStyle({ [cssProp]: val ? `${val}px` : '0px' });
          });
        });
        this.on('change:data-cell-w', () => {
          const val = this.get('data-cell-w');
          if (val) this.addStyle({ width: `${val}%` });
        });
        this.on('change:data-cell-bg', () => {
          const val = this.get('data-cell-bg');
          this.addStyle({ 'background-color': val || 'transparent' });
        });
      },
    },
  });

  gjs.DomComponents.addType('table', {
    extend: 'table',
    model: {
      defaults: {
        highlightable: true,
        selectable: true,
        draggable: true,
        droppable: true,
        stylable: true,
        toolbar: [
          { attributes: { class: 'fa fa-arrows' }, command: 'tlb-move' },
          { attributes: { class: 'fa fa-clone' }, command: 'tlb-clone' },
          { attributes: { class: 'fa fa-trash-o' }, command: 'tlb-delete' },
        ],
      },
    },
  });

  gjs.DomComponents.addType('row', {
    extend: 'row',
    model: {
      defaults: {
        highlightable: true,
        selectable: true,
        draggable: 'table, tbody, thead, tfoot',
        droppable: true,
        stylable: true,
        toolbar: [
          { attributes: { class: 'fa fa-arrows' }, command: 'tlb-move' },
          { attributes: { class: 'fa fa-clone' }, command: 'tlb-clone' },
          { attributes: { class: 'fa fa-trash-o' }, command: 'tlb-delete' },
        ],
      },
    },
  });
}

export function registerLinkComponents(gjs: Editor) {
  gjs.DomComponents.addType('link-image', {
    extend: 'link',
    model: {
      defaults: {
        tagName: 'a',
        droppable: false,
        traits: [
          { type: 'text', name: 'href', label: 'Link URL', placeholder: 'https://' },
          { type: 'select', name: 'target', label: 'Açılış', options: [
            { id: '_blank', value: '_blank', name: 'Yeni Sekme' },
            { id: '_self', value: '_self', name: 'Aynı Sayfa' },
          ]},
        ],
        components: [{
          type: 'image',
          attributes: { src: 'https://via.placeholder.com/350x200', alt: 'Görsel' },
          style: { 'max-width': '100%', height: 'auto', display: 'block' },
        }],
      },
    },
  });

  gjs.DomComponents.addType('link', {
    model: {
      defaults: {
        traits: [
          { type: 'text', name: 'href', label: 'Link URL' },
          { type: 'select', name: 'target', label: 'Açılış', options: [
            { id: 'self', value: '', name: 'Aynı Sayfa' },
            { id: '_blank', value: '_blank', name: 'Yeni Sekme' },
          ]},
          { type: 'text', name: 'title', label: 'Başlık' },
        ],
      },
    },
  });
}

export function registerRteActions(gjs: Editor) {
  gjs.on('rte:enable', () => {
    const rte = gjs.RichTextEditor;
    if ((rte as any).__colorAdded) return;
    (rte as any).__colorAdded = true;

    rte.add('foreColor', {
      icon: `<span style="font-weight:bold;font-size:14px;display:flex;flex-direction:column;align-items:center;line-height:1;">A<span style="display:block;width:16px;height:3px;background:red;border-radius:1px;margin-top:1px;" id="rte-color-bar"></span></span>`,
      event: 'click',
      result: (rteInstance: any, action: any) => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#ff0000';
        colorInput.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(colorInput);
        colorInput.addEventListener('input', () => {
          rteInstance.exec('foreColor', colorInput.value);
          const bar = document.getElementById('rte-color-bar');
          if (bar) bar.style.background = colorInput.value;
        });
        colorInput.addEventListener('change', () => {
          document.body.removeChild(colorInput);
        });
        colorInput.click();
      },
    });

    rte.add('hiliteColor', {
      icon: `<span style="font-weight:bold;font-size:13px;background:#ffeb3b;padding:0 3px;border-radius:2px;">A</span>`,
      event: 'click',
      result: (rteInstance: any) => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#ffeb3b';
        colorInput.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(colorInput);
        colorInput.addEventListener('input', () => {
          rteInstance.exec('hiliteColor', colorInput.value);
        });
        colorInput.addEventListener('change', () => {
          document.body.removeChild(colorInput);
        });
        colorInput.click();
      },
    });

    rte.add('fontSize', {
      icon: `<span style="font-size:12px;font-weight:600;">T↕</span>`,
      event: 'click',
      result: (rteInstance: any) => {
        const size = prompt('Yazı boyutu (1-7):', '3');
        if (size) rteInstance.exec('fontSize', size);
      },
    });
  });
}

export function getResolvedStyle(comp: any): Record<string, string> {
  const inline = comp.getStyle() || {};
  try {
    const el = comp.getEl();
    if (!el) return inline;
    const cs = el.ownerDocument?.defaultView?.getComputedStyle(el);
    if (!cs) return inline;
    const result: Record<string, string> = { ...inline };
    [
      'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
      'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
      'color', 'background-color', 'font-size', 'width', 'height',
    ].forEach(prop => {
      if (!result[prop]) {
        const val = cs.getPropertyValue(prop);
        if (val && val !== '0px' && val !== 'auto' && val !== 'none'
          && val !== 'rgba(0, 0, 0, 0)' && val !== 'normal') {
          result[prop] = val;
        }
      }
    });
    return result;
  } catch {
    return inline;
  }
}

export function migrateCssRulesToInline(gjs: Editor) {
  try {
    const allRules = (gjs.CssComposer.getAll() as any).models || [];
    const toRemove: any[] = [];
    allRules.forEach((rule: any) => {
      if (rule.get('mediaText') || rule.get('state') || rule.get('atRuleType')) return;
      const selectors = rule.get('selectors');
      if (!selectors || selectors.length !== 1) return;
      const ruleStyle = rule.getStyle();
      if (!ruleStyle || !Object.keys(ruleStyle).length) return;
      const sel = selectors.at(0);
      const name = sel?.get?.('name') || sel?.toString?.() || '';
      if (!name) return;
      const wrapper = gjs.getWrapper();
      if (!wrapper) return;
      let comps = wrapper.find(`#${name}`);
      if (!comps?.length) comps = wrapper.find(`.${name}`);
      if (comps?.length === 1) {
        const comp = comps[0];
        const existing = comp.getStyle() || {};
        comp.setStyle({ ...ruleStyle, ...existing });
        toRemove.push(rule);
      }
    });
    toRemove.forEach(r => {
      try { gjs.CssComposer.remove(r); } catch {}
    });
  } catch {}
}
