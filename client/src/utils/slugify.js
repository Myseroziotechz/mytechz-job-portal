export default function slugify(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFKD') // separate accents
    .replace(/\p{Diacritic}/gu, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}