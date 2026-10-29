import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../AppContext';
import { Button, Card, Icon, Screen, Txt } from '../../components/ui';
import { fonts, radius } from '../../theme';

export default function Subscription() {
  const { c, t, lang, notifyPro, setNotifyPro } = useApp();
  const perks =
    lang === 'fr'
      ? ['Couverture élargie des services', 'Rapports d’utilisation avancés', 'Concierges dédiés à votre organisation']
      : ['Wider service coverage', 'Advanced usage reports', 'Concierges dedicated to your organization'];
  return (
    <Screen title={t('subscription')}>
      <Card style={{ marginTop: 12, borderColor: c.success, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="checkmark-circle" size={22} color={c.success} />
          <Txt variant="h3" color={c.success}>{t('pilotStatus')}</Txt>
        </View>
        <Txt variant="small">{t('pilotBody')}</Txt>
      </Card>

      <LinearGradient colors={[c.heroStart, c.heroEnd]} style={{ borderRadius: radius.lg, padding: 22, marginTop: 20, gap: 12 }}>
        <Text style={{ fontFamily: fonts.semi, fontSize: 11, letterSpacing: 1.6, color: '#D4B47A' }}>{lang === 'fr' ? 'À VENIR' : 'COMING SOON'}</Text>
        <Text style={{ fontFamily: fonts.title, fontSize: 26, color: c.onHero }}>{t('proTitle')}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: c.onHeroMuted }}>{t('proBody')}</Text>
        {perks.map((p) => (
          <View key={p} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="diamond-outline" size={14} color="#D4B47A" />
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: c.onHero }}>{p}</Text>
          </View>
        ))}
        <View style={{ height: 4 }} />
        {notifyPro ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52, justifyContent: 'center' }}>
            <Icon name="notifications" size={18} color="#D4B47A" />
            <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: c.onHero }}>{t('notified')}</Text>
          </View>
        ) : (
          <Button label={t('notifyMe')} icon="notifications-outline" onPress={() => setNotifyPro(true)} variant="gold" />
        )}
      </LinearGradient>
    </Screen>
  );
}
