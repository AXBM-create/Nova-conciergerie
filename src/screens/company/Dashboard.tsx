import React from 'react';
import { View } from 'react-native';
import { useApp } from '../../AppContext';
import { Card, Icon, Screen, SectionTitle, Txt } from '../../components/ui';
import { DASHBOARD, categoryById } from '../../data';
import { radius } from '../../theme';

function Kpi({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  const { c } = useApp();
  return (
    <Card style={{ width: '47.5%', gap: 8 }}>
      <Icon name={icon} size={20} color={c.goldText} />
      <Txt variant="display" style={{ fontSize: 28, lineHeight: 32 }}>{value}</Txt>
      <Txt variant="small">{label}</Txt>
      {sub ? <Txt variant="caption" color={c.success}>{sub}</Txt> : null}
    </Card>
  );
}

export default function Dashboard() {
  const { c, t, lang } = useApp();
  const d = DASHBOARD;
  const maxWeek = Math.max(...d.weekly);
  const maxCat = Math.max(...d.topCategories.map((x) => x.value));
  return (
    <Screen title={t('dashboard')}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <Icon name="flask-outline" size={13} color={c.textMuted} />
        <Txt variant="caption">Atelier Boréal · {t('demoData')}</Txt>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Kpi icon="people-outline" label={t('activeUsers')} value={`${d.activeUsers}`} sub={`${Math.round((d.activeUsers / d.totalUsers) * 100)} % / ${d.totalUsers}`} />
        <Kpi icon="list-outline" label={t('monthRequests')} value={`${d.monthRequests}`} sub="+18 %" />
        <Kpi icon="hourglass-outline" label={t('hoursSaved')} value={`${d.hoursSaved} h`} />
        <Kpi icon="star-outline" label={t('satisfaction')} value={lang === 'fr' ? `${String(d.satisfaction).replace('.', ',')}/5` : `${d.satisfaction}/5`} />
      </View>

      <SectionTitle title={t('weeklyActivity')} />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 8 }} accessibilityLabel={d.weekly.join(', ')}>
          {d.weekly.map((v, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Txt variant="caption">{v}</Txt>
              <View style={{ width: '100%', height: (v / maxWeek) * 100, borderRadius: 6, backgroundColor: i === d.weekly.length - 1 ? c.gold : c.primary, opacity: i === d.weekly.length - 1 ? 1 : 0.85 }} />
              <Txt variant="caption">S{i + 1}</Txt>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle title={t('topCategories')} />
      <Card style={{ gap: 14 }}>
        {d.topCategories.map((x) => {
          const cat = categoryById(x.id);
          return (
            <View key={x.id} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt variant="small" color={c.text}>{cat.label[lang]}</Txt>
                <Txt variant="caption">{x.value}</Txt>
              </View>
              <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: c.surfaceAlt }}>
                <View style={{ height: 8, width: `${(x.value / maxCat) * 100}%`, borderRadius: radius.pill, backgroundColor: c.gold }} />
              </View>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
