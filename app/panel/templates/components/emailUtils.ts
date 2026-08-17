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

export const EMAIL_RESPONSIVE_CSS = `
@media only screen and (max-width: 600px) {
  .email-container { width: 100% !important; max-width: 100% !important; min-width: 100% !important; }
  .email-container img { width: 100% !important; max-width: 100% !important; height: auto !important; }
  .email-col-stack { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
}
`;

export function buildEmailDocument(
  bodyContent: string,
  css: string,
  bodyBg: string,
  previewWidth?: number,
): string {
  const viewportMeta = previewWidth
    ? `<meta name="viewport" content="width=${previewWidth}, initial-scale=1">`
    : '<meta name="viewport" content="width=device-width, initial-scale=1">';

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  ${viewportMeta}
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
${EMAIL_RESPONSIVE_CSS}
  </style>
</head>
<body style="margin:0;padding:0;background-color:#e8ecf0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8ecf0;">
    <tr>
      <td align="center" valign="top" style="padding:0;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${bodyBg};margin:0 auto;table-layout:fixed;">
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
}
