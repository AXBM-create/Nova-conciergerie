import React from 'react';
import { View } from 'react-native';
import { useApp } from '../../AppContext';
import { Avatar, Card, Screen, Txt } from '../../components/ui';
import { useRootNav } from '../../navigation/useRootNav';

export default function Messages() {
  const { t, requests } = useApp();
  const nav = useRootNav();
  const threads = requests.filter((r) => r.messages.length > 0);
  return (
    <Screen title={t('messagesTitle')}>
      <View style={{ height: 12 }} />
      {threads.length === 0 ? <Card><Txt variant="small">{t('empty')}</Txt></Card> : null}
      {threads.map((r) => {
        const last = r.messages[r.messages.length - 1];
        return (
          <Card key={r.id} onPress={() => nav.navigate('RequestDetail', { id: r.id })} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Avatar initials={r.concierge.initials} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <Txt variant="h3" numberOfLines={1} style={{ flex: 1 }}>{r.concierge.name}</Txt>
                  <Txt variant="caption">{last.time}</Txt>
                </View>
                <Txt variant="caption" numberOfLines={1}>{r.title}</Txt>
                <Txt variant="small" numberOfLines={1}>{last.from === 'me' ? '↩︎ ' : ''}{last.text}</Txt>
              </View>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
