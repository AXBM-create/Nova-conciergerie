import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { Button, Card, Chip, Field, Icon, Txt } from '../../components/ui';
import { ADDRESSES, CATEGORIES, categoryById, type CategoryId, type Request } from '../../data';
import type { RootProps } from '../../navigation/types';
import { radius } from '../../theme';

type AddrKind = 'office' | 'home' | 'other';

export default function NewRequest({ navigation, route }: RootProps<'NewRequest'>) {
  const { c, t, lang, addRequest } = useApp();
  const [category, setCategory] = useState<CategoryId>(route.params?.category ?? 'groceries');
  const [desc, setDesc] = useState(route.params?.title ?? '');
  const [when, setWhen] = useState('');
  const [addrKind, setAddrKind] = useState<AddrKind>('office');
  const [otherAddr, setOtherAddr] = useState('');
  const [budget, setBudget] = useState('');
  const [attached, setAttached] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<Request | null>(null);

  const cat = categoryById(category);
  const address = addrKind === 'other' ? otherAddr : ADDRESSES[addrKind];

  const submit = () => {
    if (!desc.trim()) {
      setError(t('missingDesc'));
      return;
    }
    const req = addRequest({
      category,
      title: desc.trim(),
      when: when.trim() || (lang === 'fr' ? 'Dès que possible' : 'As soon as possible'),
      address: address || ADDRESSES.office,
      budget: budget ? Number(budget.replace(',', '.')) : undefined,
    });
    setSent(req);
  };

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: 24, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 14 }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkmark-done" size={42} color={c.success} />
          </View>
          <Txt variant="display" style={{ textAlign: 'center' }}>{t('requestSent')}</Txt>
          <Txt variant="body" color={c.textMuted} style={{ textAlign: 'center' }}>{t('requestSentBody')}</Txt>
          <Txt variant="h2" color={c.goldText}>{sent.ref}</Txt>
        </View>
        <View style={{ gap: 10, marginTop: 36 }}>
          <Button label={t('track')} icon="navigate-outline" onPress={() => navigation.replace('RequestDetail', { id: sent.id })} />
          <Button label={t('close')} variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Txt variant="label" style={{ marginBottom: 8 }}>{t('category')}</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
          {CATEGORIES.map((k) => (
            <Chip key={k.id} icon={k.icon} label={k.label[lang]} selected={k.id === category} onPress={() => setCategory(k.id)} />
          ))}
        </ScrollView>

        <Field label={t('description')} value={desc} onChangeText={(s) => { setDesc(s); setError(''); }} placeholder={t('descriptionPh')} multiline />
        {error ? <Txt variant="caption" color={c.danger} style={{ marginTop: -8, marginBottom: 12 }}>{error}</Txt> : null}
        <Field label={t('when')} value={when} onChangeText={setWhen} placeholder={t('whenPh')} />

        <Txt variant="label" style={{ marginBottom: 8 }}>{t('address')}</Txt>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          {(['office', 'home', 'other'] as AddrKind[]).map((k) => (
            <Chip key={k} label={t(k)} selected={addrKind === k} onPress={() => setAddrKind(k)} icon={k === 'office' ? 'briefcase-outline' : k === 'home' ? 'home-outline' : 'location-outline'} />
          ))}
        </View>
        {addrKind === 'other' ? (
          <Field label={t('other')} value={otherAddr} onChangeText={setOtherAddr} placeholder="1234, rue…" />
        ) : (
          <Txt variant="small" style={{ marginBottom: 16 }}>{ADDRESSES[addrKind]}</Txt>
        )}

        <Field label={t('budget')} value={budget} onChangeText={setBudget} placeholder="50" keyboardType="numeric" />

        <Pressable
          accessibilityRole="button"
          onPress={() => setAttached(!attached)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: c.border, borderRadius: radius.sm, padding: 14, marginBottom: 20 }}
        >
          <Icon name={attached ? 'document-attach' : 'attach-outline'} size={20} color={c.goldText} />
          <Txt variant="body">{attached ? t('attached') : t('attachment')}</Txt>
        </Pressable>

        <Card style={{ backgroundColor: c.surfaceAlt, borderColor: c.surfaceAlt, marginBottom: 20 }}>
          <Txt variant="label" style={{ marginBottom: 10 }}>{t('estimate')}</Txt>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Txt variant="small">{t('estPrice')}</Txt>
              <Txt variant="h2">{lang === 'fr' ? `${cat.basePrice} $` : `$${cat.basePrice}`}</Txt>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Txt variant="small">{t('estDelay')}</Txt>
              <Txt variant="h2">{cat.delay[lang]}</Txt>
            </View>
          </View>
        </Card>

        <Button label={t('submitRequest')} icon="paper-plane-outline" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
