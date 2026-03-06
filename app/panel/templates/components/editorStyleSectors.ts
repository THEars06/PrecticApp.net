export const editorStyleSectors = [
  {
    name: 'Boyut',
    open: true,
    properties: [
      'width', 'height', 'max-width', 'min-width', 'min-height', 'max-height',
    ],
  },
  {
    name: 'Boşluklar',
    open: true,
    properties: [
      { name: 'Üst Padding', property: 'padding-top' },
      { name: 'Sağ Padding', property: 'padding-right' },
      { name: 'Alt Padding', property: 'padding-bottom' },
      { name: 'Sol Padding', property: 'padding-left' },
      { name: 'Üst Margin', property: 'margin-top' },
      { name: 'Sağ Margin', property: 'margin-right' },
      { name: 'Alt Margin', property: 'margin-bottom' },
      { name: 'Sol Margin', property: 'margin-left' },
    ],
  },
  {
    name: 'Flex / Grid',
    open: false,
    properties: [
      { name: 'Display', property: 'display', type: 'select', defaults: 'block', options: [
        { id: 'block', value: 'block', name: 'Block' },
        { id: 'inline-block', value: 'inline-block', name: 'Inline Block' },
        { id: 'flex', value: 'flex', name: 'Flex' },
        { id: 'grid', value: 'grid', name: 'Grid' },
        { id: 'none', value: 'none', name: 'None' },
      ]},
      { name: 'Flex Direction', property: 'flex-direction', type: 'select', defaults: 'row', options: [
        { id: 'row', value: 'row', name: 'Row →' },
        { id: 'row-reverse', value: 'row-reverse', name: 'Row Reverse ←' },
        { id: 'column', value: 'column', name: 'Column ↓' },
        { id: 'column-reverse', value: 'column-reverse', name: 'Column Reverse ↑' },
      ]},
      { name: 'Justify Content', property: 'justify-content', type: 'select', defaults: 'flex-start', options: [
        { id: 'flex-start', value: 'flex-start', name: 'Start' },
        { id: 'flex-end', value: 'flex-end', name: 'End' },
        { id: 'center', value: 'center', name: 'Center' },
        { id: 'space-between', value: 'space-between', name: 'Space Between' },
        { id: 'space-around', value: 'space-around', name: 'Space Around' },
      ]},
      { name: 'Align Items', property: 'align-items', type: 'select', defaults: 'stretch', options: [
        { id: 'flex-start', value: 'flex-start', name: 'Start' },
        { id: 'flex-end', value: 'flex-end', name: 'End' },
        { id: 'center', value: 'center', name: 'Center' },
        { id: 'stretch', value: 'stretch', name: 'Stretch' },
        { id: 'baseline', value: 'baseline', name: 'Baseline' },
      ]},
      { name: 'Flex Wrap', property: 'flex-wrap', type: 'select', defaults: 'nowrap', options: [
        { id: 'nowrap', value: 'nowrap', name: 'No Wrap' },
        { id: 'wrap', value: 'wrap', name: 'Wrap' },
      ]},
      { name: 'Gap', property: 'gap' },
      { name: 'Row Gap', property: 'row-gap' },
      { name: 'Column Gap', property: 'column-gap' },
      { name: 'Flex', property: 'flex' },
      { name: 'Grid Columns', property: 'grid-template-columns' },
      { name: 'Grid Rows', property: 'grid-template-rows' },
    ],
  },
  {
    name: 'Tipografi',
    open: false,
    properties: [
      'font-family', 'font-size', 'font-weight', 'letter-spacing',
      'color', 'line-height', 'text-align', 'text-decoration',
    ],
  },
  {
    name: 'Dekorasyon',
    open: false,
    properties: [
      'background-color', 'background', 'background-image',
      'border-radius', 'border', 'box-shadow',
    ],
  },
  {
    name: 'Konum',
    open: false,
    properties: [
      { name: 'Position', property: 'position', type: 'select', defaults: 'static', options: [
        { id: 'static', value: 'static', name: 'Static' },
        { id: 'relative', value: 'relative', name: 'Relative' },
        { id: 'absolute', value: 'absolute', name: 'Absolute' },
        { id: 'fixed', value: 'fixed', name: 'Fixed' },
      ]},
      'top', 'right', 'bottom', 'left', 'z-index',
    ],
  },
  {
    name: 'Ekstra',
    open: false,
    properties: ['opacity', 'overflow', 'cursor', 'transition'],
  },
];
