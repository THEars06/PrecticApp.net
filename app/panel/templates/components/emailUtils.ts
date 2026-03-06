export function parseCssDeclarations(decl: string): Record<string, string> {
  const map: Record<string, string> = {};
  decl.split(';').forEach(part => {
    const colonIdx = part.indexOf(':');
    if (colonIdx < 1) return;
    const prop = part.substring(0, colonIdx).trim().toLowerCase();
    const val = part.substring(colonIdx + 1).trim();
    if (prop && val) map[prop] = val;
  });
  return map;
}

export function styleMapToString(map: Record<string, string>): string {
  return Object.entries(map).map(([k, v]) => `${k}:${v}`).join(';');
}

export function inlineCssIntoHtml(html: string, css: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<html><body>${html}</body></html>`, 'text/html');

    // 1) CSS kurallarını inline'a çevir (inline stil öncelikli!)
    const cleanCss = css.replace(/@media[^{]*\{[\s\S]*?\}\s*\}/gi, '');
    const ruleRegex = /([^{@][^{]*)\{([^}]+)\}/g;
    let match: RegExpExecArray | null;
    while ((match = ruleRegex.exec(cleanCss)) !== null) {
      const rawSelector = match[1].trim();
      const declarations = match[2].trim();
      if (!rawSelector || rawSelector.startsWith('@') || rawSelector === '*') continue;
      const selectors = rawSelector.split(',').map(s => s.trim()).filter(Boolean);
      for (const selector of selectors) {
        if (selector.includes(':') || selector === 'body' || selector === 'html') continue;
        try {
          const els = doc.body.querySelectorAll(selector);
          els.forEach((el) => {
            const existing = parseCssDeclarations(el.getAttribute('style') || '');
            const incoming = parseCssDeclarations(declarations);
            el.setAttribute('style', styleMapToString({ ...incoming, ...existing }));
          });
        } catch {}
      }
    }

    // 2) HTML5 semantic etiketleri div'e çevir (email uyumluluğu)
    ['section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'figure', 'figcaption', 'blockquote'].forEach(tag => {
      const els = doc.body.querySelectorAll(tag);
      els.forEach(el => {
        const div = doc.createElement('div');
        div.innerHTML = el.innerHTML;
        Array.from(el.attributes).forEach(attr => div.setAttribute(attr.name, attr.value));
        el.parentNode?.replaceChild(div, el);
      });
    });

    // 3) Block elementlere eksik margin sıfırlama (inline style yoksa)
    doc.body.querySelectorAll('div,p,h1,h2,h3,h4,h5,h6,blockquote,ul,ol,li').forEach(el => {
      const s = parseCssDeclarations(el.getAttribute('style') || '');
      const hasAnyMargin = s['margin'] || s['margin-top'] || s['margin-bottom'] || s['margin-left'] || s['margin-right'];
      if (!hasAnyMargin) {
        s['margin-top'] = '0';
        s['margin-bottom'] = '0';
        s['margin-left'] = '0';
        s['margin-right'] = '0';
      } else if (!s['margin']) {
        if (!s['margin-top']) s['margin-top'] = '0';
        if (!s['margin-bottom']) s['margin-bottom'] = '0';
        if (!s['margin-left']) s['margin-left'] = '0';
        if (!s['margin-right']) s['margin-right'] = '0';
      }
      if (s['width']) {
        const pw = parseInt(s['width']);
        if (!isNaN(pw) && s['width'].endsWith('px') && pw > 600) {
          s['width'] = '100%';
        }
      }
      if (!s['font-family'] && ['p','h1','h2','h3','h4','h5','h6','li','blockquote'].includes(el.tagName.toLowerCase())) {
        s['font-family'] = 'Arial, Helvetica, sans-serif';
      }
      el.setAttribute('style', styleMapToString(s));
    });

    // 4) img: width/height attribute + display:block + max-width sınırı
    doc.body.querySelectorAll('img').forEach((img) => {
      const s = parseCssDeclarations(img.getAttribute('style') || '');
      if (!s['display']) s['display'] = 'block';
      if (!s['border']) s['border'] = '0';
      if (!s['outline']) s['outline'] = 'none';
      const w = s['width'];
      if (w && w.endsWith('px')) {
        const pxVal = parseInt(w);
        if (pxVal > 600) {
          s['width'] = '100%';
          s['max-width'] = '600px';
        }
        if (!img.getAttribute('width')) {
          img.setAttribute('width', Math.min(pxVal, 600).toString());
        }
      }
      if (w === '100%' || !w) {
        if (!img.getAttribute('width')) img.setAttribute('width', '600');
      }
      const h = s['height'];
      if (h && h.endsWith('px') && !img.getAttribute('height')) {
        img.setAttribute('height', parseInt(h).toString());
      }
      if (!s['max-width']) s['max-width'] = '100%';
      if (!s['height'] || s['height'] === 'auto') s['height'] = 'auto';
      img.setAttribute('style', styleMapToString(s));
    });

    // 5) table/td email attribute'ları
    doc.body.querySelectorAll('table').forEach(table => {
      if (!table.getAttribute('cellpadding')) table.setAttribute('cellpadding', '0');
      if (!table.getAttribute('cellspacing')) table.setAttribute('cellspacing', '0');
      if (!table.getAttribute('border')) table.setAttribute('border', '0');
      const s = parseCssDeclarations(table.getAttribute('style') || '');
      if (!s['border-collapse']) s['border-collapse'] = 'collapse';
      if (!s['mso-table-lspace']) s['mso-table-lspace'] = '0pt';
      if (!s['mso-table-rspace']) s['mso-table-rspace'] = '0pt';
      table.setAttribute('style', styleMapToString(s));
    });

    doc.body.querySelectorAll('td,th').forEach(cell => {
      const s = parseCssDeclarations(cell.getAttribute('style') || '');
      if (!s['font-family']) s['font-family'] = 'Arial, Helvetica, sans-serif';
      cell.setAttribute('style', styleMapToString(s));
    });

    // 6) Link, span, font elementlerine font-family
    doc.body.querySelectorAll('a,span,font').forEach(el => {
      const s = parseCssDeclarations(el.getAttribute('style') || '');
      if (!s['font-family']) s['font-family'] = 'Arial, Helvetica, sans-serif';
      el.setAttribute('style', styleMapToString(s));
    });

    // 7) Gradient fallback: background:linear-gradient olan elementlere background-color ekle
    doc.body.querySelectorAll('*').forEach(el => {
      const s = parseCssDeclarations(el.getAttribute('style') || '');
      if (s['background'] && s['background'].includes('gradient') && !s['background-color']) {
        const colorMatch = s['background'].match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/);
        if (colorMatch) {
          s['background-color'] = colorMatch[0];
          el.setAttribute('style', styleMapToString(s));
        }
      }
    });

    // 8) display:flex/grid → email uyumsuz, block'a çevir
    doc.body.querySelectorAll('*').forEach(el => {
      const s = parseCssDeclarations(el.getAttribute('style') || '');
      if (s['display'] === 'flex' || s['display'] === 'grid') {
        s['display'] = 'block';
        delete s['gap'];
        delete s['row-gap'];
        delete s['column-gap'];
        delete s['justify-content'];
        delete s['align-items'];
        delete s['flex-direction'];
        delete s['flex-wrap'];
        el.setAttribute('style', styleMapToString(s));
      }
      if (s['object-fit']) {
        delete s['object-fit'];
        el.setAttribute('style', styleMapToString(s));
      }
    });

    return doc.body.innerHTML;
  } catch {
    return html;
  }
}
