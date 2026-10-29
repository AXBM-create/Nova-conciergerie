import React, { useState } from 'react';
import { View } from 'react-native';
import { useApp } from '../../AppContext';
import { Card, Chip, Screen, Txt, Button } from '../../components/ui';
import RequestCard from '../../components/RequestCard';
import { useRootNav } from '../../navigation/useRootNav';

type Tab = 'ongoing' | 'history' | 'favorites';

export default function Requests() {
  const { t, requests, favorites } = useApp();
  const nav = useRootNav();
  const [tab, setTab] = useState<Tab>('ongoing');
  const list =
    tab === 'ongoing'
      ? requests.filter((r) => r.status !== 'done')
      : tab === 'history'
        ? requests.filter((r) => r.status === 'done')
        : requests.filter((r) => favorites.includes(r.id));

  return (
    <Screen title={t('requestsTitle')}>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 14 }}>
        <Chip label={t('tabOngoing')} selected={tab === 'ongoing'} onPress={() => setTab('ongoing')} />
        <Chip label={t('tabHistory')} selected={tab === 'history'} onPress={() => setTab('history')} />
        <Chip label={t('tabFavorites')} selected={tab === 'favorites'} onPress={() => setTab('favorites')} icon="heart-outline" />
      </View>
      {list.length === 0 ? (
        <Card style={{ alignItems: 'center', gap: 12 }}>
          <Txt variant="small">{t('empty')}</Txt>
          <Button label={t('newRequest')} icon="add" onPress={() => nav.navigate('NewRequest')} />
        </Card>
      ) : (
        list.map((r) => <RequestCard key={r.id} request={r} />)
      )}
    </Screen>
  );
}
