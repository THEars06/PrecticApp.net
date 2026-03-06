export const editorCanvasCss = `
  * { box-sizing: border-box; }
  html {
    background-color: #e8ecf0;
    min-height: 100%;
    height: auto;
  }
  body {
    margin: 0 auto !important;
    padding: 0 !important;
    width: 600px !important;
    max-width: 600px !important;
    min-height: 3000px;
    height: auto;
    position: relative;
    border-left: 1px solid #c7d2de;
    border-right: 1px solid #c7d2de;
    box-shadow: 0 0 40px rgba(0,0,0,0.08);
    padding-bottom: 200px;
    font-family: Arial, Helvetica, sans-serif;
    overflow-x: hidden;
  }
  body > * {
    max-width: 100% !important;
  }
  /* Email ile aynı reset - WYSIWYG */
  div, p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, li {
    margin: 0;
    padding: 0;
  }
  img {
    display: block;
    max-width: 100%;
    border: 0;
    outline: none;
  }
  table, td {
    border-collapse: collapse;
  }
  a, span, font {
    font-family: Arial, Helvetica, sans-serif;
  }
  /* Boş td hücrelerine placeholder */
  td:empty::before {
    content: 'İçerik sürükle...';
    color: #c0c0c0;
    font-size: 12px;
    font-style: italic;
    display: block;
    text-align: center;
    padding: 15px 5px;
    border: 1px dashed #d0d0d0;
    border-radius: 4px;
    pointer-events: none;
  }
`;
