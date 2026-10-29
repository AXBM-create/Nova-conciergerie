import type { Lang } from './i18n';

export type CategoryId =
  | 'groceries'
  | 'laundry'
  | 'bookings'
  | 'errands'
  | 'home'
  | 'parcels'
  | 'gifts'
  | 'car';

export type Category = {
  id: CategoryId;
  icon: string; // Ionicons
  label: Record<Lang, string>;
  hint: Record<Lang, string>;
  basePrice: number; // CAD, indicative
  delay: Record<Lang, string>;
  keywords: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: 'groceries',
    icon: 'basket-outline',
    label: { fr: 'Courses et épicerie', en: 'Groceries' },
    hint: { fr: 'Marché, épicerie, pharmacie', en: 'Market, grocery, pharmacy' },
    basePrice: 25,
    delay: { fr: '2 à 4 h', en: '2–4 h' },
    keywords: ['courses', 'épicerie', 'epicerie', 'marché', 'marche', 'pharmacie', 'grocer', 'market', 'pain', 'fromage', 'fruits'],
  },
  {
    id: 'laundry',
    icon: 'shirt-outline',
    label: { fr: 'Pressing et nettoyage', en: 'Dry cleaning' },
    hint: { fr: 'Collecte et retour au bureau', en: 'Pickup and return at work' },
    basePrice: 20,
    delay: { fr: '24 à 48 h', en: '24–48 h' },
    keywords: ['pressing', 'nettoyage', 'chemise', 'costume', 'lavage', 'laundry', 'dry', 'shirt', 'suit'],
  },
  {
    id: 'bookings',
    icon: 'restaurant-outline',
    label: { fr: 'Réservations', en: 'Bookings' },
    hint: { fr: 'Restaurants, spectacles, voyages', en: 'Restaurants, shows, travel' },
    basePrice: 15,
    delay: { fr: '1 à 3 h', en: '1–3 h' },
    keywords: ['réserv', 'reserv', 'restaurant', 'table', 'spectacle', 'billet', 'voyage', 'hôtel', 'hotel', 'book', 'show', 'ticket', 'trip'],
  },
  {
    id: 'errands',
    icon: 'calendar-outline',
    label: { fr: 'Rendez-vous et formalités', en: 'Appointments & admin' },
    hint: { fr: 'Prises de rendez-vous, démarches', en: 'Appointments, paperwork' },
    basePrice: 20,
    delay: { fr: '1 à 2 jours', en: '1–2 days' },
    keywords: ['rendez-vous', 'rdv', 'formalité', 'passeport', 'permis', 'papier', 'appointment', 'paperwork', 'document'],
  },
  {
    id: 'home',
    icon: 'hammer-outline',
    label: { fr: 'Entretien et réparations', en: 'Home repairs' },
    hint: { fr: 'Plombier, électricien, ménage', en: 'Plumber, electrician, cleaning' },
    basePrice: 40,
    delay: { fr: '1 à 3 jours', en: '1–3 days' },
    keywords: ['réparation', 'reparation', 'plombier', 'électricien', 'electricien', 'ménage', 'menage', 'fuite', 'repair', 'plumber', 'cleaning', 'leak'],
  },
  {
    id: 'parcels',
    icon: 'cube-outline',
    label: { fr: 'Colis et livraisons', en: 'Parcels & delivery' },
    hint: { fr: 'Envois, retours, récupérations', en: 'Shipping, returns, pickups' },
    basePrice: 15,
    delay: { fr: 'Dans la journée', en: 'Same day' },
    keywords: ['colis', 'livraison', 'retour', 'poste', 'envoyer', 'parcel', 'delivery', 'return', 'ship'],
  },
  {
    id: 'gifts',
    icon: 'gift-outline',
    label: { fr: 'Cadeaux et événements', en: 'Gifts & events' },
    hint: { fr: 'Fleurs, surprises, organisation', en: 'Flowers, surprises, planning' },
    basePrice: 30,
    delay: { fr: '1 à 2 jours', en: '1–2 days' },
    keywords: ['cadeau', 'fleurs', 'anniversaire', 'fête', 'fete', 'événement', 'evenement', 'gift', 'flowers', 'birthday', 'party', 'event'],
  },
  {
    id: 'car',
    icon: 'car-outline',
    label: { fr: 'Soins de l’auto', en: 'Car care' },
    hint: { fr: 'Pneus, lavage, entretien', en: 'Tires, wash, service' },
    basePrice: 35,
    delay: { fr: '1 à 2 jours', en: '1–2 days' },
    keywords: ['auto', 'voiture', 'pneu', 'lavage auto', 'garage', 'vidange', 'car', 'tire', 'tyre', 'oil'],
  },
];

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

export type Status = 'received' | 'assigned' | 'inProgress' | 'done';
export const STATUSES: Status[] = ['received', 'assigned', 'inProgress', 'done'];

export type Message = { id: string; from: 'me' | 'concierge'; text: string; time: string };

export type Request = {
  id: string;
  ref: string;
  category: CategoryId;
  title: string;
  when: string;
  address: string;
  budget?: number;
  status: Status;
  createdAt: string;
  concierge: { name: string; initials: string };
  messages: Message[];
  rating?: number;
};

export const CONCIERGES = [
  { name: 'Élodie Gagnon', initials: 'ÉG' },
  { name: 'Marc-André Roy', initials: 'MR' },
  { name: 'Sofia Benali', initials: 'SB' },
];

export const ADDRESSES = {
  office: 'Atelier Boréal — 700, rue Saint-Antoine Est',
  home: 'Plateau-Mont-Royal — rue Fabre',
};

export const QUICK_REQUESTS: { category: CategoryId; title: Record<Lang, string> }[] = [
  { category: 'groceries', title: { fr: 'Panier du Marché Jean-Talon', en: 'Jean-Talon Market basket' } },
  { category: 'laundry', title: { fr: 'Pressing : 3 chemises', en: 'Dry cleaning: 3 shirts' } },
  { category: 'bookings', title: { fr: 'Table pour 4 vendredi', en: 'Table for 4 on Friday' } },
  { category: 'car', title: { fr: 'Pneus d’hiver au bureau', en: 'Winter tires at the office' } },
];

export const INITIAL_REQUESTS: Request[] = [
  {
    id: 'r1',
    ref: 'NOVA-MTL-2481',
    category: 'groceries',
    title: 'Panier du Marché Jean-Talon (fruits, fromages, pain)',
    when: 'Aujourd’hui, 17 h',
    address: ADDRESSES.home,
    budget: 80,
    status: 'inProgress',
    createdAt: '29 oct.',
    concierge: CONCIERGES[0],
    messages: [
      { id: 'm1', from: 'concierge', text: 'Bonjour Camille, je suis au marché. Les clémentines sont superbes, j’en ajoute ?', time: '14 h 12' },
      { id: 'm2', from: 'me', text: 'Oui, merci ! Un petit sac suffit.', time: '14 h 15' },
      { id: 'm3', from: 'concierge', text: 'Parfait, livraison prévue vers 17 h.', time: '14 h 16' },
    ],
  },
  {
    id: 'r2',
    ref: 'NOVA-MTL-2477',
    category: 'laundry',
    title: 'Pressing : 2 complets et 4 chemises',
    when: 'Jeudi, au bureau',
    address: ADDRESSES.office,
    status: 'assigned',
    createdAt: '28 oct.',
    concierge: CONCIERGES[1],
    messages: [
      { id: 'm1', from: 'concierge', text: 'Je passe récupérer vos vêtements à la réception demain à 10 h.', time: 'Hier' },
    ],
  },
  {
    id: 'r3',
    ref: 'NOVA-MTL-2402',
    category: 'bookings',
    title: 'Table pour 4 à la Maison Cèdre, samedi 19 h',
    when: 'Samedi, 19 h',
    address: ADDRESSES.home,
    status: 'done',
    createdAt: '22 oct.',
    concierge: CONCIERGES[2],
    rating: 5,
    messages: [
      { id: 'm1', from: 'concierge', text: 'Réservation confirmée, table près de la fenêtre.', time: '22 oct.' },
    ],
  },
  {
    id: 'r4',
    ref: 'NOVA-MTL-2365',
    category: 'car',
    title: 'Pose des pneus d’hiver',
    when: '18 oct.',
    address: ADDRESSES.office,
    status: 'done',
    createdAt: '15 oct.',
    concierge: CONCIERGES[1],
    rating: 4,
    messages: [],
  },
];

export type Member = { id: string; name: string; email: string; dept: string; status: 'active' | 'invited' | 'inactive'; requests: number };

export const INITIAL_MEMBERS: Member[] = [
  { id: 'u1', name: 'Camille Tremblay', email: 'camille@atelierboreal.ca', dept: 'Design', status: 'active', requests: 12 },
  { id: 'u2', name: 'Olivier Bouchard', email: 'olivier@atelierboreal.ca', dept: 'Ingénierie', status: 'active', requests: 9 },
  { id: 'u3', name: 'Amira Haddad', email: 'amira@atelierboreal.ca', dept: 'Ventes', status: 'active', requests: 7 },
  { id: 'u4', name: 'Félix Côté', email: 'felix@atelierboreal.ca', dept: 'Finances', status: 'invited', requests: 0 },
  { id: 'u5', name: 'Léa Nguyen', email: 'lea@atelierboreal.ca', dept: 'RH', status: 'active', requests: 15 },
  { id: 'u6', name: 'Samuel Pelletier', email: 'samuel@atelierboreal.ca', dept: 'Ingénierie', status: 'inactive', requests: 2 },
];

export type Feedback = { id: string; author: string; rating: number; text: string; date: string };

export const INITIAL_FEEDBACK: Feedback[] = [
  { id: 'f1', author: 'Léa N.', rating: 5, text: 'Le pressing livré au bureau, c’est un vrai gain de temps. On veut le garder !', date: '27 oct.' },
  { id: 'f2', author: 'Olivier B.', rating: 4, text: 'Très pratique. J’aimerais pouvoir suivre la livraison sur une carte.', date: '24 oct.' },
  { id: 'f3', author: 'Amira H.', rating: 5, text: 'L’assistant a compris ma demande du premier coup.', date: '21 oct.' },
];

export const DASHBOARD = {
  activeUsers: 42,
  totalUsers: 50,
  monthRequests: 96,
  hoursSaved: 138,
  satisfaction: 4.7,
  weekly: [6, 9, 11, 10, 14, 16, 13, 17],
  topCategories: [
    { id: 'laundry' as CategoryId, value: 31 },
    { id: 'groceries' as CategoryId, value: 24 },
    { id: 'bookings' as CategoryId, value: 18 },
    { id: 'parcels' as CategoryId, value: 13 },
    { id: 'car' as CategoryId, value: 10 },
  ],
};
