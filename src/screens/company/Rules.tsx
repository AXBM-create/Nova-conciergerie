import React from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useApp } from '../../AppContext';
import { Card, Icon, Screen, SectionTitle, Txt } from '../../components/ui';
import { CategoryIcon } from '../../components/RequestCard';
import { CATEGORIES } from '../../data';
import { radius } from '../../theme';

export default function Rules() {
  const { c, t, lang, covered, toggleCovered, monthlyCap, setMonthlyCap } = useApp();
  return (
    <Screen title={t('rules')}>
      <SectionTitle title={t('monthlyCap')} />
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="-1"
          onPress={() => setMonthlyCap(Math.max(1, monthlyCap - 1))}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="remove" size={22} color={c.text} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Txt variant="display">{monthlyCap}</Txt>
          <Txt variant="caption">{t('hoursPerMonth')}</Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="+1"
          onPress={() => setMonthlyCap(Math.min(40, monthlyCap + 1))}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="add" size={22} color={c.text} />
        </Pressable>
      </Card>

      <SectionTitle title={t('coveredServices')} />
      <Card style={{ paddingVertical: 6 }}>
        {CATEGORIES.map((cat, i) => (
          <View key={cat.id}>
            {i > 0 ? <View style={{ height: 1, backgroundColor: c.border }} /> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60 }}>
              <CategoryIcon icon={cat.icon} size={36} />
              <Txt variant="body" style={{ flex: 1 }}>{cat.label[lang]}</Txt>
              <Switch accessibilityLabel={cat.label[lang]} value={covered[cat.id]} onValueChange={() => toggleCovered(cat.id)} trackColor={{ true: c.gold, false: c.border }} />
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
