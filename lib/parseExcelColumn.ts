export type ExcelColumnKind = 'phone' | 'email';

export type ParseExcelResult = {
  values: string[];
  skippedEmpty: number;
  skippedInvalid: number;
  skippedHeader: boolean;
};

function cellToString(value: unknown): string {
  if (value == null || value === '') return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    if (Math.abs(value) >= 1e10) return String(Math.round(value));
    return String(value);
  }
  const text = String(value).trim();
  if (/^\d+(\.\d+)?e[+-]?\d+$/i.test(text)) {
    const n = Number(text);
    if (Number.isFinite(n)) return String(Math.round(n));
  }
  return text;
}

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isValidPhone(value: string): boolean {
  const digits = phoneDigits(value);
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(value: string): boolean {
  const email = value.trim();
  return email.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidValue(value: string, kind: ExcelColumnKind): boolean {
  return kind === 'phone' ? isValidPhone(value) : isValidEmail(value);
}

function normalizeValue(value: string, kind: ExcelColumnKind): string {
  if (kind === 'email') return value.trim().toLowerCase();
  return value.trim();
}

function dedupeKey(value: string, kind: ExcelColumnKind): string {
  if (kind === 'phone') return phoneDigits(value);
  return value.trim().toLowerCase();
}

export async function parseExcelFirstColumn(
  file: File,
  kind: ExcelColumnKind,
): Promise<ParseExcelResult> {
  const mod = await import('xlsx');
  const XLSX = (mod as { utils?: unknown }).utils ? mod : (mod as { default: typeof import('xlsx') }).default;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', raw: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { values: [], skippedEmpty: 0, skippedInvalid: 0, skippedHeader: false };
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: '',
    blankrows: false,
  }) as unknown[][];

  let skippedEmpty = 0;
  let skippedInvalid = 0;
  let skippedHeader = false;
  const values: string[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const raw = cellToString(Array.isArray(row) ? row[0] : '');
    if (!raw) {
      skippedEmpty += 1;
      return;
    }

    if (index === 0 && !isValidValue(raw, kind)) {
      skippedHeader = true;
      return;
    }

    if (!isValidValue(raw, kind)) {
      skippedInvalid += 1;
      return;
    }

    const normalized = normalizeValue(raw, kind);
    const key = dedupeKey(normalized, kind);
    if (!key || seen.has(key)) {
      skippedInvalid += 1;
      return;
    }
    seen.add(key);
    values.push(normalized);
  });

  return { values, skippedEmpty, skippedInvalid, skippedHeader };
}
