export const editorBlocks = [
  // ─── TEMEL ───
  {
    id: 'section',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Bölüm</div>',
    category: 'Temel',
    content: '<section style="padding:40px 20px;min-height:80px;width:100%;"><h2>Başlık</h2><p>İçerik buraya...</p></section>',
  },
  {
    id: 'text',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><div class="gjs-block-label">Metin</div>',
    category: 'Temel',
    content: '<p style="padding:10px;font-size:16px;line-height:1.6;width:100%;">Metin içeriği buraya yazın...</p>',
  },
  {
    id: 'heading',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><text x="3" y="18" font-size="17" font-weight="bold" fill="currentColor">H1</text></svg><div class="gjs-block-label">Başlık</div>',
    category: 'Temel',
    content: '<h1 style="padding:10px;font-size:32px;font-weight:700;line-height:1.2;width:100%;">Başlık</h1>',
  },
  {
    id: 'subheading',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><text x="3" y="18" font-size="14" font-weight="bold" fill="currentColor">H2</text></svg><div class="gjs-block-label">Alt Başlık</div>',
    category: 'Temel',
    content: '<h2 style="padding:10px;font-size:22px;font-weight:600;width:100%;">Alt Başlık</h2>',
  },
  {
    id: 'image',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Görsel</div>',
    category: 'Temel',
    content: { type: 'image' },
  },
  {
    id: 'link-image',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Linkli Görsel</div>',
    category: 'Temel',
    content: { type: 'link-image' },
  },
  {
    id: 'button',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Buton</div>',
    category: 'Temel',
    content: '<a href="#" style="display:inline-block;padding:12px 28px;background:#2b2973;color:white;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">Tıkla</a>',
  },
  {
    id: 'divider',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Ayırıcı</div>',
    category: 'Temel',
    content: '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:20px 0;"><div style="border-top:1px solid #e5e7eb;font-size:0;height:1px;line-height:0;">&nbsp;</div></td></tr></table>',
  },
  {
    id: 'spacer',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><path d="M5 8h14M5 16h14M12 8v8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg><div class="gjs-block-label">Boşluk</div>',
    category: 'Temel',
    content: '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:30px;font-size:0;line-height:0;">&nbsp;</td></tr></table>',
  },
  {
    id: 'link',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="1.5" fill="none"/></svg><div class="gjs-block-label">Link</div>',
    category: 'Temel',
    content: '<a href="#" style="color:#2b2973;text-decoration:underline;">Buraya tıklayın</a>',
  },
  {
    id: 'quote',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Alıntı</div>',
    category: 'Temel',
    content: '<blockquote style="border-left:4px solid #2b2973;margin:20px 0;padding:15px 20px;background:#f5f5ff;font-style:italic;color:#444;font-size:16px;">Alıntı metni buraya...</blockquote>',
  },
  // ─── DÜZEN (Table-based — email uyumlu) ───
  {
    id: 'two-columns',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">2 Sütun</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:50%;padding:10px;" valign="top"></td><td style="width:50%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'two-columns-gap',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/><rect x="14" y="3" width="8" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">2 Sütun + Boşluk</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:48%;padding:10px;" valign="top"></td><td style="width:4%;">&nbsp;</td><td style="width:48%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'three-columns',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">3 Sütun</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:33.33%;padding:10px;" valign="top"></td><td style="width:33.33%;padding:10px;" valign="top"></td><td style="width:33.33%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'four-columns',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="7" y="3" width="4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="12" y="3" width="4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="17" y="3" width="4" height="18" fill="none" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">4 Sütun</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:25%;padding:8px;" valign="top"></td><td style="width:25%;padding:8px;" valign="top"></td><td style="width:25%;padding:8px;" valign="top"></td><td style="width:25%;padding:8px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'sidebar-layout',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="3" width="11" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Sidebar + İçerik</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:180px;padding:15px;" valign="top"></td><td style="padding:15px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'grid-2x2',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="13" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="13" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Grid 2x2</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:50%;padding:10px;" valign="top"></td><td style="width:50%;padding:10px;" valign="top"></td></tr><tr><td style="width:50%;padding:10px;" valign="top"></td><td style="width:50%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'container',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2"/></svg><div class="gjs-block-label">Container</div>',
    category: 'Düzen',
    content: '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="padding:20px;" valign="top"></td></tr></table>',
  },
  {
    id: 'one-third-two-third',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="3" width="12" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">1/3 + 2/3</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:33.33%;padding:10px;" valign="top"></td><td style="width:66.66%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'two-third-one-third',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="12" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="3" width="6" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">2/3 + 1/3</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:66.66%;padding:10px;" valign="top"></td><td style="width:33.33%;padding:10px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'five-columns',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="1" y="3" width="3.4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="5.3" y="3" width="3.4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="9.6" y="3" width="3.4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="13.9" y="3" width="3.4" height="18" fill="none" stroke="currentColor" stroke-width="1"/><rect x="18.2" y="3" width="3.4" height="18" fill="none" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">5 Sütun</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="width:20%;padding:6px;" valign="top"></td><td style="width:20%;padding:6px;" valign="top"></td><td style="width:20%;padding:6px;" valign="top"></td><td style="width:20%;padding:6px;" valign="top"></td><td style="width:20%;padding:6px;" valign="top"></td></tr></table>`,
  },
  {
    id: 'zigzag-layout',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="2" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="2" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><rect x="2" y="13" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1"/><rect x="13" y="13" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Zigzag</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tr><td style="width:50%;padding:10px;" valign="top"><img src="https://via.placeholder.com/280x180" style="width:100%;height:auto;display:block;"/></td><td style="width:50%;padding:15px;" valign="middle"><h3 style="margin:0 0 8px;">Başlık</h3><p style="margin:0;color:#666;font-size:14px;">Açıklama metni buraya...</p></td></tr>
  <tr><td style="width:50%;padding:15px;" valign="middle"><h3 style="margin:0 0 8px;">Başlık</h3><p style="margin:0;color:#666;font-size:14px;">Açıklama metni buraya...</p></td><td style="width:50%;padding:10px;" valign="top"><img src="https://via.placeholder.com/280x180" style="width:100%;height:auto;display:block;"/></td></tr>
</table>`,
  },
  {
    id: 'hero-two-cards',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="14" width="9" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="14" width="9" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Hero + 2 Kart</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tr><td colspan="2" style="padding:10px;" valign="top"><div style="background:#f1f5f9;padding:40px 20px;text-align:center;border-radius:8px;"><h2 style="margin:0 0 10px;">Hero Başlık</h2><p style="margin:0;color:#666;">Alt açıklama metni</p></div></td></tr>
  <tr><td style="width:50%;padding:10px;" valign="top"><div style="background:#f8fafc;padding:20px;border-radius:8px;border:1px solid #e2e8f0;"><h3 style="margin:0 0 8px;">Kart 1</h3><p style="margin:0;color:#666;font-size:14px;">İçerik</p></div></td><td style="width:50%;padding:10px;" valign="top"><div style="background:#f8fafc;padding:20px;border-radius:8px;border:1px solid #e2e8f0;"><h3 style="margin:0 0 8px;">Kart 2</h3><p style="margin:0;color:#666;font-size:14px;">İçerik</p></div></td></tr>
</table>`,
  },
  {
    id: 'three-card-grid',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="1" y="3" width="6" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="3" width="6" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="17" y="3" width="6" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">3 Kart Grid</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tr>
    <td style="width:33.33%;padding:8px;" valign="top"><div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><img src="https://via.placeholder.com/185x120" style="width:100%;height:auto;display:block;"/><div style="padding:15px;"><h4 style="margin:0 0 6px;font-size:15px;">Kart 1</h4><p style="margin:0;font-size:13px;color:#666;">Açıklama</p></div></div></td>
    <td style="width:33.33%;padding:8px;" valign="top"><div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><img src="https://via.placeholder.com/185x120" style="width:100%;height:auto;display:block;"/><div style="padding:15px;"><h4 style="margin:0 0 6px;font-size:15px;">Kart 2</h4><p style="margin:0;font-size:13px;color:#666;">Açıklama</p></div></div></td>
    <td style="width:33.33%;padding:8px;" valign="top"><div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;"><img src="https://via.placeholder.com/185x120" style="width:100%;height:auto;display:block;"/><div style="padding:15px;"><h4 style="margin:0 0 6px;font-size:15px;">Kart 3</h4><p style="margin:0;font-size:13px;color:#666;">Açıklama</p></div></div></td>
  </tr>
</table>`,
  },
  {
    id: 'full-width-separator',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/></svg><div class="gjs-block-label">Tam Bölücü</div>',
    category: 'Düzen',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td style="padding:0;"><div style="background-color:#f1f5f9;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);padding:30px 20px;text-align:center;"><div style="border-top:2px solid #cbd5e1;max-width:80%;margin:0 auto;"></div></div></td></tr></table>`,
  },
  // ─── MEDYA ───
  {
    id: 'video-embed',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg><div class="gjs-block-label">Video</div>',
    category: 'Medya',
    content: '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>',
  },
  {
    id: 'image-gallery-2',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="5" width="9" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="5" width="9" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">2 Görsel</div>',
    category: 'Medya',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tr>
    <td style="width:50%;padding:5px;" valign="top"><img src="https://via.placeholder.com/280x200" style="width:100%;height:auto;display:block;" /></td>
    <td style="width:50%;padding:5px;" valign="top"><img src="https://via.placeholder.com/280x200" style="width:100%;height:auto;display:block;" /></td>
  </tr>
</table>`,
  },
  {
    id: 'image-gallery-3',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="5" width="6" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="5" width="6" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="5" width="6" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">3 Görsel</div>',
    category: 'Medya',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tr>
    <td style="width:33.33%;padding:5px;" valign="top"><img src="https://via.placeholder.com/185x160" style="width:100%;height:auto;display:block;" /></td>
    <td style="width:33.33%;padding:5px;" valign="top"><img src="https://via.placeholder.com/185x160" style="width:100%;height:auto;display:block;" /></td>
    <td style="width:33.33%;padding:5px;" valign="top"><img src="https://via.placeholder.com/185x160" style="width:100%;height:auto;display:block;" /></td>
  </tr>
</table>`,
  },
  // ─── MAİL ───
  {
    id: 'hero-section',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Hero</div>',
    category: 'Mail',
    content: `<div style="background-color:#1a1a2e;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);padding:60px 20px;text-align:center;">
  <img src="https://via.placeholder.com/120" alt="Logo" style="width:80px;height:80px;border-radius:50%;margin:0 auto 20px;display:block;"/>
  <h1 style="color:#ffffff;font-size:36px;margin:0 0 15px;">Hoş Geldiniz!</h1>
  <p style="color:rgba(255,255,255,0.8);font-size:18px;max-width:500px;margin:0 auto 25px;">En iyi deneyimi yaşamak için hemen keşfedin</p>
  <a href="#" style="display:inline-block;padding:16px 40px;background-color:#e94560;color:#ffffff;text-decoration:none;border-radius:30px;font-weight:600;font-size:16px;">Başlayın</a>
</div>`,
  },
  {
    id: 'promo-banner',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><div class="gjs-block-label">Promosyon</div>',
    category: 'Mail',
    content: `<div style="background-color:#667eea;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;text-align:center;border-radius:12px;">
  <h2 style="color:#ffffff;font-size:28px;margin:0 0 10px;">Özel Kampanya!</h2>
  <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0 0 20px;">Bu fırsatı kaçırmayın</p>
  <a href="#" style="display:inline-block;padding:14px 32px;background-color:#ffffff;color:#764ba2;text-decoration:none;border-radius:8px;font-weight:600;">İncele</a>
</div>`,
  },
  {
    id: 'product-card',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="5" width="14" height="8" fill="none" stroke="currentColor" stroke-width="1"/><line x1="5" y1="16" x2="19" y2="16" stroke="currentColor" stroke-width="1"/><line x1="5" y1="19" x2="12" y2="19" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Ürün Kartı</div>',
    category: 'Mail',
    content: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:280px;background-color:#ffffff;border:1px solid #e5e7eb;">
  <tr><td style="padding:0;"><a href="#"><img src="https://via.placeholder.com/280x180" alt="Ürün" style="width:100%;height:auto;display:block;" /></a></td></tr>
  <tr><td style="padding:20px;">
    <h3 style="font-size:18px;margin:0 0 8px;color:#333;">Ürün Adı</h3>
    <p style="color:#666;font-size:14px;margin:0 0 15px;">Kısa açıklama</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-size:20px;font-weight:bold;color:#2b2973;">₺199</td>
      <td style="text-align:right;"><a href="#" style="padding:10px 20px;background:#2b2973;color:white;text-decoration:none;border-radius:6px;font-size:14px;display:inline-block;">Satın Al</a></td>
    </tr></table>
  </td></tr>
</table>`,
  },
  {
    id: 'social-icons',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div class="gjs-block-label">Sosyal</div>',
    category: 'Mail',
    content: `<div style="text-align:center;padding:20px;">
  <a href="#" style="display:inline-block;width:40px;height:40px;background:#1877f2;border-radius:50%;margin:0 5px;line-height:40px;color:white;text-decoration:none;font-weight:bold;">f</a>
  <a href="#" style="display:inline-block;width:40px;height:40px;background:#1da1f2;border-radius:50%;margin:0 5px;line-height:40px;color:white;text-decoration:none;font-weight:bold;">t</a>
  <a href="#" style="display:inline-block;width:40px;height:40px;background:#e4405f;border-radius:50%;margin:0 5px;line-height:40px;color:white;text-decoration:none;font-weight:bold;">i</a>
  <a href="#" style="display:inline-block;width:40px;height:40px;background:#0077b5;border-radius:50%;margin:0 5px;line-height:40px;color:white;text-decoration:none;font-weight:bold;">in</a>
</div>`,
  },
  {
    id: 'footer',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="15" width="18" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Footer</div>',
    category: 'Mail',
    content: `<div style="background-color:#f9fafb;padding:30px 20px;text-align:center;border-top:1px solid #e5e7eb;">
  <p style="color:#6b7280;font-size:14px;margin:0 0 10px;">© 2025 Şirket Adı. Tüm hakları saklıdır.</p>
  <p style="color:#9ca3af;font-size:12px;margin:0;">Bu e-postayı almak istemiyorsanız <a href="#" style="color:#6b7280;">abonelikten çıkın</a>.</p>
</div>`,
  },
  // ─── ETKİNLİK ───
  {
    id: 'event-ticket',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 6v12M15 10h2M15 14h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><div class="gjs-block-label">Bilet Kartı</div>',
    category: 'Etkinlik',
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
  <tr><td style="background-color:#1a1a2e;padding:30px 25px;">
    <p style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.6);margin:0 0 8px;">ETKİNLİK</p>
    <h2 style="font-size:24px;font-weight:700;margin:0 0 5px;color:#ffffff;">Etkinlik Adı</h2>
    <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0;">Sanatçı / Konuşmacı Adı</p>
  </td></tr>
  <tr><td style="padding:0;border-bottom:1px dashed #e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:20px 15px 20px 25px;" valign="top"><p style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin:0;">Tarih</p><p style="font-weight:600;color:#111;margin:4px 0 0;">15 Mart 2025</p></td>
        <td style="padding:20px 15px;" valign="top"><p style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin:0;">Saat</p><p style="font-weight:600;color:#111;margin:4px 0 0;">20:00</p></td>
        <td style="padding:20px 25px 20px 15px;" valign="top"><p style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin:0;">Mekan</p><p style="font-weight:600;color:#111;margin:4px 0 0;">İstanbul</p></td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:20px 25px;text-align:center;">
    <a href="#" style="display:inline-block;padding:14px 40px;background-color:#e94560;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">Bilet Al</a>
  </td></tr>
</table>`,
  },
  {
    id: 'event-banner',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><div class="gjs-block-label">Etkinlik Banner</div>',
    category: 'Etkinlik',
    content: `<div style="background-color:#0f0c29;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);padding:50px 30px;text-align:center;color:#ffffff;border-radius:12px;">
  <p style="font-size:13px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.6);margin:0 0 15px;">ÖZEL ETKİNLİK</p>
  <h1 style="font-size:42px;font-weight:800;margin:0 0 10px;color:#ffffff;">ETKİNLİK ADI</h1>
  <p style="font-size:18px;color:rgba(255,255,255,0.7);margin:0 0 30px;">15 Mart 2025 · İstanbul</p>
  <a href="#" style="display:inline-block;padding:16px 50px;background-color:#e94560;color:#ffffff;text-decoration:none;border-radius:30px;font-weight:700;font-size:18px;letter-spacing:0.5px;">BİLET AL</a>
</div>`,
  },
  {
    id: 'countdown',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><div class="gjs-block-label">Geri Sayım</div>',
    category: 'Etkinlik',
    content: `<div style="background-color:#1a1a2e;padding:40px 20px;text-align:center;border-radius:12px;">
  <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 20px;text-transform:uppercase;letter-spacing:2px;">ETKİNLİĞE KALAN SÜRE</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr>
      <td style="padding:0 8px;" align="center" valign="top"><div style="background-color:rgba(255,255,255,0.1);border-radius:10px;padding:15px 20px;min-width:70px;text-align:center;"><span style="display:block;font-size:36px;font-weight:700;color:#ffffff;">05</span><span style="display:block;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Gün</span></div></td>
      <td style="padding:0 8px;" align="center" valign="top"><div style="background-color:rgba(255,255,255,0.1);border-radius:10px;padding:15px 20px;min-width:70px;text-align:center;"><span style="display:block;font-size:36px;font-weight:700;color:#ffffff;">12</span><span style="display:block;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Saat</span></div></td>
      <td style="padding:0 8px;" align="center" valign="top"><div style="background-color:rgba(255,255,255,0.1);border-radius:10px;padding:15px 20px;min-width:70px;text-align:center;"><span style="display:block;font-size:36px;font-weight:700;color:#ffffff;">45</span><span style="display:block;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Dakika</span></div></td>
      <td style="padding:0 8px;" align="center" valign="top"><div style="background-color:rgba(255,255,255,0.1);border-radius:10px;padding:15px 20px;min-width:70px;text-align:center;"><span style="display:block;font-size:36px;font-weight:700;color:#e94560;">30</span><span style="display:block;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Saniye</span></div></td>
    </tr>
  </table>
</div>`,
  },
  // ─── TABLO ───
  {
    id: 'table-basic',
    label: '<svg class="w-7 h-7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="1"/><line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" stroke-width="1"/><line x1="15" y1="9" x2="15" y2="21" stroke="currentColor" stroke-width="1"/></svg><div class="gjs-block-label">Tablo</div>',
    category: 'Tablo',
    content: `<table style="width:100%;border-collapse:collapse;font-size:14px;">
  <thead>
    <tr style="background:#2b2973;color:white;">
      <th style="padding:12px 15px;text-align:left;border:1px solid #ddd;">Başlık 1</th>
      <th style="padding:12px 15px;text-align:left;border:1px solid #ddd;">Başlık 2</th>
      <th style="padding:12px 15px;text-align:left;border:1px solid #ddd;">Başlık 3</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:white;"><td style="padding:10px 15px;border:1px solid #ddd;">Veri 1</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 2</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 3</td></tr>
    <tr style="background:#f9fafb;"><td style="padding:10px 15px;border:1px solid #ddd;">Veri 4</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 5</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 6</td></tr>
    <tr style="background:white;"><td style="padding:10px 15px;border:1px solid #ddd;">Veri 7</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 8</td><td style="padding:10px 15px;border:1px solid #ddd;">Veri 9</td></tr>
  </tbody>
</table>`,
  },
];
