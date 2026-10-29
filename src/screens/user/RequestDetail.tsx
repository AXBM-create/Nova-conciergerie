import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../AppContext';
import { Avatar, Button, Card, Icon, Stars, StatusBadge, Txt } from '../../components/ui';
import { CategoryIcon } from '../../components/RequestCard';
import { categoryById, STATUSES } from '../../data';
import type { RootProps } from '../../navigation/types';
import { fonts, radius } from '../../theme';

export default function RequestDetail({ navigation, route }: RootProps<'RequestDetail'>) {
  const { c, t, lang, requests, sendMessage, rateRequest, favorites, toggleFavorite } = useApp();
  const req = requests.find((r) => r.id === route.params.id);
  const [msg, setMsg] = useState('');
  const scrollRef = useRef<ScrollViewInstance>(null);
  const isFav = req ? favorites.includes(req.id) : false;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: req?.ref ?? '',
      headerRight: () =>
        req ? (
          <Pressable onPress={() => toggleFavorite(req.id)} hitSlop={10} accessibilityRole="button" accessibilityLabel={isFav ? t('removeFavorite') : t('addFavorite')}>
            <Icon name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? c.danger : c.text} />
          </Pressable>
        ) : null,
    });
  }, [navigation, req, isFav, c, t, toggleFavorite]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [req?.messages.length]);

  if (!req) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Txt>{t('empty')}</Txt>
      </View>
    );
  }

  const cat = categoryById(req.category);
  const currentIdx = STATUSES.indexOf(req.status);
  const send = () => {
    if (!msg.trim()) return;
    sendMessage(req.id, msg.trim());
    setMsg('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <CategoryIcon icon={cat.icon} size={52} />
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="label">{cat.label[lang]}</Txt>
            <Txt variant="h2">{req.title}</Txt>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusBadge status={req.status} />
          <Txt variant="small">{req.when}</Txt>
        </View>
        <Txt variant="small" style={{ marginTop: 6 }}>{req.address}</Txt>

        <Txt variant="label" style={{ marginTop: 24, marginBottom: 12 }}>{t('timeline')}</Txt>
        <Card>
          {STATUSES.map((s, i) => {
            const reached = i <= currentIdx;
            const key = (`st_${s}`) as Parameters<typeof t>[0];
            return (
              <View key={s} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: reached ? c.gold : c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                    {reached ? <Icon name="checkmark" size={13} color="#0B132B" /> : null}
                  </View>
                  {i < STATUSES.length - 1 ? <View style={{ width: 2, height: 24, backgroundColor: i < currentIdx ? c.gold : c.border }} /> : null}
                </View>
                <Txt variant={i === currentIdx ? 'h3' : 'body'} color={reached ? c.text : c.textMuted} style={{ paddingTop: 1 }}>
                  {t(key)}
                </Txt>
              </View>
            );
          })}
        </Card>

        <Txt variant="label" style={{ marginTop: 24, marginBottom: 12 }}>{t('concierge')}</Txt>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar initials={req.concierge.initials} size={46} />
          <View style={{ flex: 1 }}>
            <Txt variant="h3">{req.concierge.name}</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="ribbon-outline" size={13} color={c.goldText} />
              <Txt variant="caption" color={c.goldText}>{t('certified')}</Txt>
            </View>
          </View>
        </Card>

        {req.status === 'done' ? (
          <Card style={{ marginTop: 16, alignItems: 'center', gap: 10 }}>
            <Txt variant="h3">{req.rating ? t('thanksRating') : t('rateTitle')}</Txt>
            <Stars value={req.rating ?? 0} onChange={(n) => rateRequest(req.id, n)} />
            <Button
              label={t('duplicate')}
              variant="ghost"
              icon="repeat-outline"
              onPress={() => navigation.navigate('NewRequest', { category: req.category, title: req.title })}
              style={{ alignSelf: 'stretch', marginTop: 6 }}
            />
          </Card>
        ) : null}

        <Txt variant="label" style={{ marginTop: 24, marginBottom: 12 }}>{t('conversation')}</Txt>
        {req.messages.length === 0 ? <Txt variant="small">{t('empty')}</Txt> : null}
        {req.messages.map((m) => (
          <View key={m.id} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '85%', marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: m.from === 'me' ? c.primary : c.surface,
                borderWidth: m.from === 'me' ? 0 : 1,
                borderColor: c.border,
                borderRadius: radius.md,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              <Txt variant="body" color={m.from === 'me' ? c.onPrimary : c.text}>{m.text}</Txt>
            </View>
            <Txt variant="caption" style={{ marginTop: 2, alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start' }}>{m.time}</Txt>
          </View>
        ))}
      </ScrollView>

      {req.status !== 'done' ? (
        <SafeAreaView edges={['bottom']} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.surface }}>
          <TextInput
            accessibilityLabel={t('messagePh')}
            value={msg}
            onChangeText={setMsg}
            onSubmitEditing={send}
            placeholder={t('messagePh')}
            placeholderTextColor={c.textMuted}
            returnKeyType="send"
            style={{ flex: 1, minHeight: 46, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, paddingHorizontal: 16, fontFamily: fonts.body, fontSize: 15, color: c.text }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel={t('send')} onPress={send} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-up" size={20} color={c.onPrimary} />
          </Pressable>
        </SafeAreaView>
      ) : null}
    </KeyboardAvoidingView>
  );
}
