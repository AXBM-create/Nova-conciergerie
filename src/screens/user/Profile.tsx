import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useApp } from '../../AppContext';
import { Avatar, Card, Icon, Screen, Txt } from '../../components/ui';
import { ADDRESSES } from '../../data';
import { useRootNav } from '../../navigation/useRootNav';

function Row({ icon, label, right, onPress }: { icon: string; label: string; right?: React.ReactNode; onPress?: () => void }) {
  const { c } = useApp();
  return (
    <Pressable disabled={!onPress} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 }}>
      <Icon name={icon} size={20} color={c.goldText} />
      <Txt variant="body" style={{ flex: 1 }}>{label}</Txt>
      {right}
    </Pressable>
  );
}

export default function Profile() {
  const { c, t, lang, setLang, isDark, toggleDark, setOnboarded, setFeedbackOpen } = useApp();
  const nav = useRootNav();
  const [notif, setNotif] = useState(true);
  return (
    <Screen title={t('profileTitle')}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <Avatar initials="CT" size={56} />
        <View style={{ flex: 1 }}>
          <Txt variant="h2">Camille Tremblay</Txt>
          <Txt variant="small">Atelier Boréal · Design</Txt>
        </View>
      </Card>

      <Txt variant="label" style={{ marginTop: 24, marginBottom: 8 }}>{t('addresses')}</Txt>
      <Card style={{ paddingVertical: 4 }}>
        <Row icon="briefcase-outline" label={`${t('office')} — ${ADDRESSES.office}`} />
        <View style={{ height: 1, backgroundColor: c.border }} />
        <Row icon="home-outline" label={`${t('home')} — ${ADDRESSES.home}`} />
      </Card>

      <Txt variant="label" style={{ marginTop: 24, marginBottom: 8 }}>{t('preferences')}</Txt>
      <Card style={{ paddingVertical: 4 }}>
        <Row
          icon="language-outline"
          label={t('language')}
          onPress={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          right={<Txt variant="h3" color={c.goldText}>{lang === 'fr' ? 'Français' : 'English'}</Txt>}
        />
        <View style={{ height: 1, backgroundColor: c.border }} />
        <Row icon="moon-outline" label={t('darkMode')} right={<Switch value={isDark} onValueChange={toggleDark} trackColor={{ true: c.gold, false: c.border }} />} />
        <View style={{ height: 1, backgroundColor: c.border }} />
        <Row icon="notifications-outline" label={t('notifications')} right={<Switch value={notif} onValueChange={setNotif} trackColor={{ true: c.gold, false: c.border }} />} />
      </Card>

      <Card style={{ paddingVertical: 4, marginTop: 16 }}>
        <Row icon="chatbubble-ellipses-outline" label={t('giveFeedback')} onPress={() => setFeedbackOpen(true)} right={<Icon name="chevron-forward" size={18} color={c.textMuted} />} />
        <View style={{ height: 1, backgroundColor: c.border }} />
        <Row
          icon="play-circle-outline"
          label={t('replayOnboarding')}
          onPress={() => {
            setOnboarded(false);
            nav.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          }}
          right={<Icon name="chevron-forward" size={18} color={c.textMuted} />}
        />
      </Card>
      <Txt variant="caption" style={{ textAlign: 'center', marginTop: 20 }}>Nova 0.1 · {t('pilot')}</Txt>
    </Screen>
  );
}
