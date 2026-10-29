import React from 'react';
import { View } from 'react-native';
import { useApp } from '../../AppContext';
import { Card, Icon, Screen, Txt } from '../../components/ui';
import { CategoryIcon } from '../../components/RequestCard';
import { CATEGORIES } from '../../data';
import { useRootNav } from '../../navigation/useRootNav';

export default function Services() {
  const { c, t, lang, covered } = useApp();
  const nav = useRootNav();
  return (
    <Screen title={t('servicesTitle')}>
      <Txt variant="small" style={{ marginBottom: 16 }}>{t('servicesSub')}</Txt>
      {CATEGORIES.map((cat) => (
        <Card key={cat.id} onPress={() => nav.navigate('NewRequest', { category: cat.id })} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <CategoryIcon icon={cat.icon} size={48} />
            <View style={{ flex: 1, gap: 2 }}>
              <Txt variant="h3">{cat.label[lang]}</Txt>
              <Txt variant="small">{cat.hint[lang]}</Txt>
              <Txt variant="caption" color={covered[cat.id] ? c.success : c.textMuted}>
                {covered[cat.id] ? `✓ ${t('covered')}` : t('notCovered')} · {cat.delay[lang]}
              </Txt>
            </View>
            <Icon name="chevron-forward" size={18} color={c.textMuted} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
