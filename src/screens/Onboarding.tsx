import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { Button, Icon, Txt } from '../components/ui';
import { fonts, radius } from '../theme';
import type { RootProps } from '../navigation/types';

export default function Onboarding({ navigation }: RootProps<'Onboarding'>) {
  const { c, t, lang, setLang, setOnboarded } = useApp();
  const [step, setStep] = useState(0);
  const slides = [
    { icon: 'time-outline', title: t('ob1Title'), body: t('ob1Body') },
    { icon: 'person-circle-outline', title: t('ob2Title'), body: t('ob2Body') },
    { icon: 'business-outline', title: t('ob3Title'), body: t('ob3Body') },
  ];
  const s = slides[step];
  const last = step === slides.length - 1;

  const finish = () => {
    setOnboarded(true);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={[c.heroStart, c.heroEnd]} style={{ flex: 1.1, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="key-outline" size={18} color="#D4B47A" />
              <Text style={{ fontFamily: fonts.title, fontSize: 22, color: c.onHero }}>Nova</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Pressable onPress={() => setLang(lang === 'fr' ? 'en' : 'fr')} hitSlop={10} accessibilityRole="button">
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.onHero }}>{lang === 'fr' ? 'EN' : 'FR'}</Text>
              </Pressable>
              {!last ? (
                <Pressable onPress={() => setStep(slides.length - 1)} hitSlop={10} accessibilityRole="button">
                  <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.onHeroMuted }}>{t('skip')}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 132, height: 132, borderRadius: 66, borderWidth: 1, borderColor: 'rgba(212,180,122,0.5)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(212,180,122,0.14)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={s.icon} size={44} color="#D4B47A" />
              </View>
            </View>
            <Text style={{ fontFamily: fonts.semi, fontSize: 11, letterSpacing: 2, color: '#D4B47A', marginTop: 28 }}>
              {lang === 'fr' ? 'CONCIERGERIE PRIVÉE · MONTRÉAL' : 'PRIVATE CONCIERGE · MONTRÉAL'}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28 }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
          {slides.map((_, i) => (
            <View key={i} style={{ height: 4, width: i === step ? 28 : 10, borderRadius: radius.pill, backgroundColor: i === step ? c.gold : c.border }} />
          ))}
        </View>
        <Txt variant="display">{s.title}</Txt>
        <Txt variant="body" color={c.textMuted} style={{ marginTop: 12 }}>{s.body}</Txt>
        <View style={{ flex: 1 }} />
        {last ? (
          <>
            <Button label={t('continueCompany')} icon="shield-checkmark-outline" onPress={finish} />
            <Txt variant="caption" style={{ textAlign: 'center', marginTop: 12, marginBottom: 8 }}>{t('demoProfile')}</Txt>
          </>
        ) : (
          <Button label={t('next')} icon="arrow-forward" onPress={() => setStep(step + 1)} style={{ marginBottom: 8 }} />
        )}
      </SafeAreaView>
    </View>
  );
}
