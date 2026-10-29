import { CATEGORIES, type CategoryId } from './data';

/**
 * Assistant concierge simulé (prototype).
 * Détecte la catégorie, la date et l'adresse dans une demande en langage naturel.
 * À remplacer par un appel à Gemini via un serveur (ne jamais mettre de clé API dans l'app).
 */

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function detectCategory(text: string): CategoryId {
  const n = normalize(text);
  let best: { id: CategoryId; score: number } = { id: 'errands', score: 0 };
  for (const cat of CATEGORIES) {
    const score = cat.keywords.reduce((acc, k) => (n.includes(normalize(k)) ? acc + 1 : acc), 0);
    if (score > best.score) best = { id: cat.id, score };
  }
  return best.id;
}

const PART = '(?: (?:matin|midi|apr[eè]s-midi|soir))?';
const HOUR = '(?:,? (?:[àa] |vers )?\\d{1,2} ?h(?: ?\\d{2})?)?';
const EN_PART = '(?: (?:morning|afternoon|evening|night))?';
const EN_HOUR = '(?:,? (?:at |around )?\\d{1,2}(?::\\d{2})? ?(?:am|pm))?';

// Ordre de priorité : la première expression trouvée l'emporte.
const WHEN_PATTERNS = [
  new RegExp(`(?:aujourd['’]hui|ce (?:matin|midi|soir)|apr[eè]s-demain|demain)${PART}${HOUR}`, 'i'),
  new RegExp(`(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)(?: prochain)?${PART}${HOUR}`, 'i'),
  /(?:cette semaine|la semaine prochaine|d[eè]s que possible)/i,
  /\d{1,2} ?h(?: ?\d{2})?/i,
  new RegExp(`(?:today|tonight|tomorrow|this (?:morning|afternoon|evening))${EN_PART}${EN_HOUR}`, 'i'),
  new RegExp(`(?:next )?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)${EN_PART}${EN_HOUR}`, 'i'),
  /(?:this week|next week|asap|as soon as possible)/i,
  /\d{1,2}(?::\d{2})? ?(?:am|pm)/i,
];

/** Renvoie l'expression de date trouvée (ex. « Demain matin »), ou null. */
export function detectWhen(text: string): string | null {
  for (const p of WHEN_PATTERNS) {
    const m = text.match(p);
    if (m) {
      const s = m[0].trim();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
  return null;
}

export function detectAddress(text: string): 'office' | 'home' | null {
  const n = normalize(text);
  if (/bureau|travail|office|work/.test(n)) return 'office';
  if (/maison|domicile|chez moi|home/.test(n)) return 'home';
  return null;
}
