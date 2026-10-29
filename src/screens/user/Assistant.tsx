import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { Button, Card, Icon, Txt } from '../../components/ui';
import { CategoryIcon } from '../../components/RequestCard';
import { ADDRESSES, categoryById, type CategoryId } from '../../data';
import { detectAddress, detectCategory, detectWhen } from '../../assistant';
import type { RootProps } from '../../navigation/types';
import { fonts, radius } from '../../theme';

type Bubble = { id: string; from: 'bot' | 'me'; text: string };
type Draft = { description: string; category: CategoryId; when: string | null; address: 'office' | 'home' | null };
type Step = 'describe' | 'when' | 'where' | 'proposal' | 'done';

export default function Assistant({ navigation, route }: RootProps<'Assistant'>) {
  const { c, t, lang, addRequest } = useApp();
  const [bubbles, setBubbles] = useState<Bubble[]>([{ id: 'hello', from: 'bot', text: t('assistantHello') }]);
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState<Step>('describe');
  const [typing, setTyping] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const started = useRef(false);

  const botSay = (text: string, next: Step) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setBubbles((b) => [...b, { id: `b${Date.now()}`, from: 'bot', text }]);
      setStep(next);
    }, 700);
  };

  const advance = (d: Draft) => {
    setDraft(d);
    if (!d.when) botSay(t('askWhen'), 'when');
    else if (!d.address) botSay(t('askWhere'), 'where');
    else botSay(t('proposal'), 'proposal');
  };

  const handle = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setBubbles((b) => [...b, { id: `u${Date.now()}`, from: 'me', text }]);
    setInput('');
    if (step === 'describe') {
      advance({ description: text, category: detectCategory(text), when: detectWhen(text), address: detectAddress(text) });
    } else if (step === 'when' && draft) {
      advance({ ...draft, when: detectWhen(text) ?? text, address: draft.address ?? detectAddress(text) });
    } else if (step === 'where' && draft) {
      advance({ ...draft, address: detectAddress(text) ?? 'office' });
    }
  };

  useEffect(() => {
    if (!started.current && route.params?.initial) {
      started.current = true;
      handle(route.params.initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [bubbles, typing, step]);

  const confirm = () => {
    if (!draft) return;
    const req = addRequest({
      category: draft.category,
      title: draft.description,
      when: draft.when ?? (lang === 'fr' ? 'Dès que possible' : 'As soon as possible'),
      address: ADDRESSES[draft.address ?? 'office'],
    });
    setCreatedId(req.id);
    setBubbles((b) => [...b, { id: `d${Date.now()}`, from: 'bot', text: `${t('assistantDone')} (${req.ref})` }]);
    setStep('done');
  };

  const cat = draft ? categoryById(draft.category) : null;
  const quickReplies =
    step === 'where'
      ? [t('office'), t('home')]
      : step === 'when'
        ? lang === 'fr'
          ? ['Aujourd’hui', 'Demain matin', 'Cette semaine']
          : ['Today', 'Tomorrow morning', 'This week']
        : [];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 20, gap: 10 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', marginBottom: 6 }}>
          <Icon name="information-circle-outline" size={14} color={c.textMuted} />
          <Txt variant="caption">{t('aiNote')}</Txt>
        </View>
        {bubbles.map((b) => (
          <View
            key={b.id}
            style={{
              alignSelf: b.from === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: b.from === 'me' ? c.primary : c.surface,
              borderWidth: b.from === 'me' ? 0 : 1,
              borderColor: c.border,
              borderRadius: radius.md,
              borderBottomRightRadius: b.from === 'me' ? 4 : radius.md,
              borderBottomLeftRadius: b.from === 'me' ? radius.md : 4,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Txt variant="body" color={b.from === 'me' ? c.onPrimary : c.text}>{b.text}</Txt>
          </View>
        ))}
        {typing ? <Txt variant="caption" style={{ marginLeft: 4 }}>• • •</Txt> : null}

        {draft && cat && (step === 'proposal' || step === 'done') ? (
          <Card style={{ borderColor: c.gold, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <CategoryIcon icon={cat.icon} />
              <View style={{ flex: 1 }}>
                <Txt variant="label">{cat.label[lang]}</Txt>
                <Txt variant="h3">{draft.description}</Txt>
              </View>
            </View>
            <Row icon="time-outline" text={draft.when ?? '—'} />
            <Row icon="location-outline" text={ADDRESSES[draft.address ?? 'office']} />
            <Row icon="pricetag-outline" text={`${t('estPrice')} : ${lang === 'fr' ? `${cat.basePrice} $` : `$${cat.basePrice}`} · ${cat.delay[lang]}`} />
            {step === 'proposal' ? (
              <Button label={t('confirmProposal')} icon="checkmark" onPress={confirm} />
            ) : createdId ? (
              <Button label={t('track')} icon="navigate-outline" onPress={() => navigation.replace('RequestDetail', { id: createdId })} />
            ) : null}
          </Card>
        ) : null}
      </ScrollView>

      {quickReplies.length ? (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 8, flexWrap: 'wrap' }}>
          {quickReplies.map((q) => (
            <Pressable key={q} onPress={() => handle(q)} accessibilityRole="button" style={{ borderWidth: 1, borderColor: c.gold, borderRadius: radius.pill, paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
              <Txt variant="small" color={c.goldText}>{q}</Txt>
            </Pressable>
          ))}
        </View>
      ) : null}

      {step !== 'proposal' && step !== 'done' ? (
        <SafeAreaView edges={['bottom']} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.surface }}>
          <TextInput
            accessibilityLabel={t('assistantPh')}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handle(input)}
            placeholder={t('assistantPh')}
            placeholderTextColor={c.textMuted}
            returnKeyType="send"
            autoFocus={!route.params?.initial}
            style={{ flex: 1, minHeight: 46, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, paddingHorizontal: 16, fontFamily: fonts.body, fontSize: 15, color: c.text }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel={t('send')} onPress={() => handle(input)} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-up" size={20} color={c.onPrimary} />
          </Pressable>
        </SafeAreaView>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Icon name={icon} size={16} color={c.goldText} />
      <Txt variant="small" style={{ flex: 1 }}>{text}</Txt>
    </View>
  );
}
