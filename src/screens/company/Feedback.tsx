import React from 'react';
import { View } from 'react-native';
import { useApp } from '../../AppContext';
import { Card, Screen, Stars, Txt } from '../../components/ui';

export default function Feedback() {
  const { c, t, lang, feedback } = useApp();
  const avg = feedback.length ? feedback.reduce((a, f) => a + f.rating, 0) / feedback.length : 0;
  const avgTxt = avg.toFixed(1);
  return (
    <Screen title={t('feedbackTitle')}>
      <Card style={{ marginTop: 12, alignItems: 'center', gap: 6 }}>
        <Txt variant="label">{t('avgRating')}</Txt>
        <Txt variant="display">{lang === 'fr' ? avgTxt.replace('.', ',') : avgTxt}</Txt>
        <Stars value={Math.round(avg)} size={22} />
        <Txt variant="caption">{feedback.length} {lang === 'fr' ? 'avis' : 'reviews'}</Txt>
      </Card>
      <View style={{ height: 16 }} />
      {feedback.map((f) => (
        <Card key={f.id} style={{ marginBottom: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Txt variant="h3">{f.author}</Txt>
            <Txt variant="caption">{f.date}</Txt>
          </View>
          <Stars value={f.rating} size={16} />
          {f.text ? <Txt variant="body" color={c.text}>{f.text}</Txt> : null}
        </Card>
      ))}
    </Screen>
  );
}
