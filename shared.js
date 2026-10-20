// קוד תוצאה: JSON מקודד + חתימה, כדי שאי אפשר יהיה לערוך ציון ידנית בקלות.
const SALT = 'td-quiz-2026';
const PREFIX = typeof QUIZ_PREFIX !== 'undefined' ? QUIZ_PREFIX : 'TD1';
const CODE_RE = new RegExp(PREFIX + '\\.[A-Za-z0-9+/=]+\\.[a-z0-9]+', 'g');

function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}
function encodeResult(obj) {
  const body = btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  return PREFIX + '.' + body + '.' + hash(SALT + body);
}
function decodeResult(code) {
  const parts = code.trim().split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  if (hash(SALT + parts[1]) !== parts[2]) return { invalid: true };
  try { return JSON.parse(decodeURIComponent(escape(atob(parts[1])))); } catch { return null; }
}
function levelFor(pct) {
  if (pct >= 90) return { text: 'מוכן/ה לנהל חשבון', cls: 'good' };
  if (pct >= 80) return { text: 'עבר/ה', cls: 'good' };
  if (pct >= 65) return { text: 'כמעט, צריך חיזוק', cls: 'bad' };
  return { text: 'לא עבר/ה, ללמוד ולנסות שוב', cls: 'bad' };
}
function colorFor(pct) {
  return pct >= 80 ? 'var(--good)' : pct >= 60 ? 'var(--warn)' : 'var(--bad)';
}
