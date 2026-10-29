import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../AppContext';
import { Card, Icon, Screen, SectionTitle, Txt } from '../../components/ui';
import RequestCard, { CategoryIcon } from '../../components/RequestCard';
import { CATEGORIES, QUICK_REQUESTS } from '../../data';
import { useRootNav } from '../../navigation/useRootNav';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { UserTabParamList } from '../../navigation/types';
import { fonts, radius } from '../../theme';

export default function Home() {
  const { c, t, lang, requests, quotaLeft } = useApp();
  const nav = useRootNav();
  const tabNav = useNavigation<BottomTabNavigationProp<UserTabParamList>>();
  const [ask, setAsk] = useState('');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');
  const ongoing = requests.filter((r) => r.status !== 'done');

  const submitAsk = () => {
    nav.navigate('Assistant', { initial: ask.trim() || undefined });
    setAsk('');
  };

  return (
    <Screen>
      <LinearGradient colors={[c.heroStart, c.heroEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.lg, padding: 20, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(212,180,122,0.45)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name="sparkles-outline" size={12} color="#D4B47A" />
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: c.onHero }}>
            {t('offeredBy')} Atelier Boréal · {lang === 'fr' ? String(quotaLeft).replace('.', ',') : quotaLeft} h
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.title, fontSize: 30, lineHeight: 36, color: c.onHero, marginTop: 14 }}>{greeting}, Camille.</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.onHeroMuted, marginTop: 6 }}>{t('heroSub')}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF7F2', borderRadius: radius.pill, paddingLeft: 16, paddingRight: 6, marginTop: 18, minHeight: 54 }}>
          <Icon name="sparkles" size={18} color="#B8955A" />
          <TextInput
            accessibilityLabel={t('askPlaceholder')}
            value={ask}
            onChangeText={setAsk}
            onSubmitEditing={submitAsk}
            placeholder={t('askPlaceholder')}
            placeholderTextColor="#6B7183"
            returnKeyType="send"
            style={{ flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: 15, color: '#0B132B', paddingHorizontal: 10, paddingVertical: 12 }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Micro" onPress={submitAsk} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="mic-outline" size={20} color="#0B132B" />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={t('ask')} onPress={submitAsk} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#0B132B', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-forward" size={18} color="#D4B47A" />
          </Pressable>
        </View>

        <Text style={{ fontFamily: fonts.semi, fontSize: 10, letterSpacing: 1.4, color: '#D4B47A', marginTop: 18, marginBottom: 10 }}>
          {t('quickRequests').toUpperCase()}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {QUICK_REQUESTS.map((q) => (
            <Pressable
              key={q.title.fr}
              accessibilityRole="button"
              onPress={() => nav.navigate('NewRequest', { category: q.category, title: q.title[lang] })}
              style={{ backgroundColor: 'rgba(250,247,242,0.1)', borderWidth: 1, borderColor: 'rgba(250,247,242,0.18)', borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 10, maxWidth: 170 }}
            >
              <Text numberOfLines={2} style={{ fontFamily: fonts.semi, fontSize: 13, color: c.onHero }}>{q.title[lang]}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      <SectionTitle title={t('ongoing')} action={t('seeAll')} onAction={() => tabNav.navigate('Requests')} />
      {ongoing.length === 0 ? (
        <Card><Txt variant="small">{t('noOngoing')}</Txt></Card>
      ) : (
        ongoing.map((r) => <RequestCard key={r.id} request={r} />)
      )}

      <SectionTitle title={t('categories')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {CATEGORIES.slice(0, 6).map((cat) => (
          <Card key={cat.id} onPress={() => nav.navigate('NewRequest', { category: cat.id })} style={{ width: '47.5%', padding: 14, gap: 10 }}>
            <CategoryIcon icon={cat.icon} size={40} />
            <Txt variant="h3" numberOfLines={2}>{cat.label[lang]}</Txt>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
