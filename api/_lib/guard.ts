// API共通の防御処理（問い合わせ・AI診断）。
// ファイル名が _ で始まるため、Vercel はこれを単独の関数としては公開しない。
//
// 方針: Express などのフレームワークを使わず、Web標準の Request / Response だけで書く。
// 依存パッケージを減らすほど、脆弱性の入り口（と更新の手間）が減る。

const ALLOWED_ORIGINS = new Set([
  'https://mgc-global01.com',
  'https://www.mgc-global01.com',
]);
// Vercel のプレビュー（このプロジェクトのものだけ）と、手元の開発環境
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/mgc-inc-[a-z0-9-]+-kokomumatsuo-starup01jps-projects\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];

export const MAX_BODY_BYTES = 16 * 1024;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const isAllowedOrigin = (origin: string | null) =>
  !!origin && (ALLOWED_ORIGINS.has(origin) || ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin)));

/** 送信元のIP（Vercel が付ける x-forwarded-for の先頭）。記録はせず、回数制限にだけ使う */
export const clientIp = (request: Request) =>
  (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

// 回数制限（関数のインスタンス内で数える簡易版）。インスタンスが複数あると厳密ではないため、
// 大量の攻撃には Vercel Firewall のレート制限を併用する。
const hits = new Map<string, number[]>();
export const rateLimited = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // メモリを使い続けないように
  return recent.length > limit;
};

/**
 * POST・送信元サイト・Content-Type・サイズを確認し、JSONを読む。
 * 問題があれば Response を返す（呼び出し側はそのまま返す）。
 */
export const readJson = async (request: Request): Promise<{ body: Record<string, unknown> } | { error: Response }> => {
  if (request.method !== 'POST') {
    return { error: new Response(null, { status: 405, headers: { allow: 'POST' } }) };
  }
  if (!isAllowedOrigin(request.headers.get('origin'))) {
    return { error: json({ success: false, message: 'Forbidden' }, 403) };
  }
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return { error: json({ success: false, message: 'Unsupported Media Type' }, 415) };
  }
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return { error: json({ success: false, message: 'Payload Too Large' }, 413) };
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { error: json({ success: false, message: 'Payload Too Large' }, 413) };
  }
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
    return { body };
  } catch {
    return { error: json({ success: false, message: 'Invalid JSON' }, 400) };
  }
};

/** 文字列として受け取り、前後の空白を除いて上限で切る（文字列以外は空文字） */
export const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const isEmail = (v: string) => v.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);

/** メール本文（HTML）に埋め込む前のエスケープ */
export const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** 件名などヘッダーに入る文字列から改行を除く */
export const oneLine = (v: string, max = 80) => v.replace(/[\r\n\t]+/g, ' ').slice(0, max);

/** 迷惑送信対策の見えない入力欄（人には見えず、ボットだけが埋める）。埋まっていたら成功を装って捨てる */
export const isBot = (body: Record<string, unknown>) => typeof body.website === 'string' && body.website.trim() !== '';
