import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { strings, type Lang, type StringKey } from './i18n';
import { dark, light, type Palette } from './theme';
import {
  CATEGORIES,
  CONCIERGES,
  INITIAL_FEEDBACK,
  INITIAL_MEMBERS,
  INITIAL_REQUESTS,
  type CategoryId,
  type Feedback,
  type Member,
  type Request,
} from './data';

export type Role = 'user' | 'company';

export type NewRequestInput = {
  category: CategoryId;
  title: string;
  when: string;
  address: string;
  budget?: number;
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
  isDark: boolean;
  toggleDark: () => void;
  c: Palette;
  role: Role;
  setRole: (r: Role) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  requests: Request[];
  addRequest: (input: NewRequestInput) => Request;
  sendMessage: (requestId: string, text: string) => void;
  rateRequest: (requestId: string, rating: number) => void;
  favorites: string[];
  toggleFavorite: (requestId: string) => void;
  members: Member[];
  inviteMember: (email: string) => void;
  toggleMember: (id: string) => void;
  covered: Record<CategoryId, boolean>;
  toggleCovered: (id: CategoryId) => void;
  monthlyCap: number;
  setMonthlyCap: (n: number) => void;
  feedback: Feedback[];
  addFeedback: (rating: number, text: string) => void;
  notifyPro: boolean;
  setNotifyPro: (v: boolean) => void;
  feedbackOpen: boolean;
  setFeedbackOpen: (v: boolean) => void;
  quotaLeft: number;
};

const AppCtx = createContext<Ctx | null>(null);

const nowTime = () => {
  const d = new Date();
  return `${d.getHours()} h ${String(d.getMinutes()).padStart(2, '0')}`;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [lang, setLang] = useState<Lang>('fr');
  const [darkOverride, setDarkOverride] = useState<boolean | null>(null);
  const isDark = darkOverride ?? scheme === 'dark';
  const [role, setRole] = useState<Role>('user');
  const [onboarded, setOnboarded] = useState(false);
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [favorites, setFavorites] = useState<string[]>(['r3']);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [covered, setCovered] = useState<Record<CategoryId, boolean>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.id !== 'car'])) as Record<CategoryId, boolean>,
  );
  const [monthlyCap, setMonthlyCap] = useState(8);
  const [feedback, setFeedback] = useState<Feedback[]>(INITIAL_FEEDBACK);
  const [notifyPro, setNotifyPro] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const counter = useRef(2490);

  const t = useCallback((k: StringKey) => strings[lang][k], [lang]);

  const addRequest = useCallback((input: NewRequestInput) => {
    counter.current += 1;
    const concierge = CONCIERGES[counter.current % CONCIERGES.length];
    const req: Request = {
      id: `r${Date.now()}`,
      ref: `NOVA-MTL-${counter.current}`,
      category: input.category,
      title: input.title,
      when: input.when,
      address: input.address,
      budget: input.budget,
      status: 'received',
      createdAt: lang === 'fr' ? 'Aujourd’hui' : 'Today',
      concierge,
      messages: [],
    };
    setRequests((prev) => [req, ...prev]);
    // Simulation : le concierge prend la demande en charge.
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === req.id
            ? {
                ...r,
                status: 'assigned',
                messages: [
                  {
                    id: `m${Date.now()}`,
                    from: 'concierge',
                    text:
                      lang === 'fr'
                        ? `Bonjour, ici ${concierge.name}. J’ai bien reçu votre demande et je m’en occupe.`
                        : `Hi, this is ${concierge.name}. I got your request and I’m on it.`,
                    time: nowTime(),
                  },
                ],
              }
            : r,
        ),
      );
    }, 4000);
    return req;
  }, [lang]);

  const sendMessage = useCallback((requestId: string, text: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, messages: [...r.messages, { id: `m${Date.now()}`, from: 'me', text, time: nowTime() }] }
          : r,
      ),
    );
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                messages: [
                  ...r.messages,
                  {
                    id: `m${Date.now()}c`,
                    from: 'concierge',
                    text: lang === 'fr' ? 'Bien noté, merci ! Je vous tiens au courant.' : 'Noted, thanks! I’ll keep you posted.',
                    time: nowTime(),
                  },
                ],
              }
            : r,
        ),
      );
    }, 2500);
  }, [lang]);

  const rateRequest = useCallback((requestId: string, rating: number) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, rating } : r)));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const inviteMember = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._-]/g, ' ');
    setMembers((prev) => [
      { id: `u${Date.now()}`, name: name.charAt(0).toUpperCase() + name.slice(1), email, dept: '—', status: 'invited', requests: 0 },
      ...prev,
    ]);
  }, []);

  const toggleMember = useCallback((id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'inactive' ? 'active' : 'inactive' } : m)),
    );
  }, []);

  const toggleCovered = useCallback((id: CategoryId) => {
    setCovered((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addFeedback = useCallback((rating: number, text: string) => {
    setFeedback((prev) => [
      { id: `f${Date.now()}`, author: 'Camille T.', rating, text, date: lang === 'fr' ? 'Aujourd’hui' : 'Today' },
      ...prev,
    ]);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t,
      isDark,
      toggleDark: () => setDarkOverride(!isDark),
      c: isDark ? dark : light,
      role,
      setRole,
      onboarded,
      setOnboarded,
      requests,
      addRequest,
      sendMessage,
      rateRequest,
      favorites,
      toggleFavorite,
      members,
      inviteMember,
      toggleMember,
      covered,
      toggleCovered,
      monthlyCap,
      setMonthlyCap,
      feedback,
      addFeedback,
      notifyPro,
      setNotifyPro,
      feedbackOpen,
      setFeedbackOpen,
      quotaLeft: 5.5,
    }),
    [lang, t, isDark, role, onboarded, requests, addRequest, sendMessage, rateRequest, favorites, toggleFavorite, members, inviteMember, toggleMember, covered, toggleCovered, monthlyCap, feedback, addFeedback, notifyPro, feedbackOpen],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
