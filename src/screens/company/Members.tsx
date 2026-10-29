import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { useApp } from '../../AppContext';
import { Avatar, Button, Card, Field, Screen, SectionTitle, Txt } from '../../components/ui';

export default function Members() {
  const { c, t, members, inviteMember, toggleMember } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const invite = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('invalidEmail'));
      return;
    }
    inviteMember(email.trim());
    setEmail('');
    setError('');
  };
  const statusLabel = { active: t('active'), invited: t('invited'), inactive: t('inactive') } as const;
  const statusColor = { active: c.success, invited: c.goldText, inactive: c.textMuted } as const;

  return (
    <Screen title={t('members')}>
      <Card style={{ marginTop: 12 }}>
        <Txt variant="h3" style={{ marginBottom: 12 }}>{t('inviteTitle')}</Txt>
        <Field label="Email" value={email} onChangeText={(s) => { setEmail(s); setError(''); }} placeholder={t('invitePh')} keyboardType="email-address" />
        {error ? <Txt variant="caption" color={c.danger} style={{ marginTop: -8, marginBottom: 10 }}>{error}</Txt> : null}
        <Button label={t('invite')} icon="mail-outline" onPress={invite} />
      </Card>

      <SectionTitle title={`${t('members')} (${members.length})`} />
      {members.map((m) => (
        <Card key={m.id} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar initials={m.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()} />
          <View style={{ flex: 1, gap: 2 }}>
            <Txt variant="h3" numberOfLines={1}>{m.name}</Txt>
            <Txt variant="caption" numberOfLines={1}>{m.email} · {m.dept}</Txt>
            <Txt variant="caption" color={statusColor[m.status]}>{statusLabel[m.status]}</Txt>
          </View>
          {m.status !== 'invited' ? (
            <Switch
              accessibilityLabel={m.name}
              value={m.status === 'active'}
              onValueChange={() => toggleMember(m.id)}
              trackColor={{ true: c.gold, false: c.border }}
            />
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}
