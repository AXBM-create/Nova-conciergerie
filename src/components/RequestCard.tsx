import React from 'react';
import { View } from 'react-native';
import { useApp } from '../AppContext';
import { categoryById, type Request } from '../data';
import { useRootNav } from '../navigation/useRootNav';
import { Card, Icon, StatusBadge, Txt } from './ui';
import { radius } from '../theme';

export function CategoryIcon({ icon, size = 44 }: { icon: string; size?: number }) {
  const { c } = useApp();
  return (
    <View style={{ width: size, height: size, borderRadius: radius.sm, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.48} color={c.goldText} />
    </View>
  );
}

export default function RequestCard({ request }: { request: Request }) {
  const { c, lang } = useApp();
  const nav = useRootNav();
  const cat = categoryById(request.category);
  return (
    <Card onPress={() => nav.navigate('RequestDetail', { id: request.id })} style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <CategoryIcon icon={cat.icon} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Txt variant="caption">{request.ref}</Txt>
            <StatusBadge status={request.status} />
          </View>
          <Txt variant="h3" numberOfLines={2}>{request.title}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="time-outline" size={14} color={c.textMuted} />
            <Txt variant="small" numberOfLines={1} style={{ flex: 1 }}>
              {request.when} · {cat.label[lang]}
            </Txt>
          </View>
        </View>
      </View>
    </Card>
  );
}
