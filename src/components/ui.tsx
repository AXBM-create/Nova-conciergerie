import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../AppContext';
import { fonts, radius } from '../theme';
import type { Status } from '../data';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
export const Icon = ({ name, size = 20, color }: { name: string; size?: number; color: string }) => (
  <Ionicons name={name as IconName} size={size} color={color} />
);

type TxtVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'label' | 'caption';

export function Txt({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: {
  children: React.ReactNode;
  variant?: TxtVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const { c } = useApp();
  const v: Record<TxtVariant, TextStyle> = {
    display: { fontFamily: fonts.title, fontSize: 32, lineHeight: 38 },
    h1: { fontFamily: fonts.title, fontSize: 26, lineHeight: 32 },
    h2: { fontFamily: fonts.titleSemi, fontSize: 20, lineHeight: 26 },
    h3: { fontFamily: fonts.semi, fontSize: 16, lineHeight: 22 },
    body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
    small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
    label: { fontFamily: fonts.semi, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
    caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  };
  const defaultColor = variant === 'small' || variant === 'caption' || variant === 'label' ? c.textMuted : c.text;
  return (
    <Text numberOfLines={numberOfLines} style={[v[variant], { color: color ?? defaultColor }, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { c, isDark } = useApp();
  const base: ViewStyle = {
    backgroundColor: c.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    ...(isDark
      ? {}
      : { shadowColor: '#0B132B', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }),
  };
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useApp();
  const bg = variant === 'primary' ? c.primary : variant === 'gold' ? '#D4B47A' : variant === 'secondary' ? c.surfaceAlt : 'transparent';
  const fg = variant === 'primary' ? c.onPrimary : variant === 'gold' ? '#0B132B' : c.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: radius.pill,
          backgroundColor: bg,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: c.border,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: string }) {
  const { c } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? c.primary : c.border,
        backgroundColor: selected ? c.primary : c.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon ? <Icon name={icon} size={16} color={selected ? c.onPrimary : c.text} /> : null}
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: selected ? c.onPrimary : c.text }}>{label}</Text>
    </Pressable>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const { c, t } = useApp();
  const map: Record<Status, { color: string; key: Parameters<typeof t>[0] }> = {
    received: { color: c.textMuted, key: 'st_received' },
    assigned: { color: c.goldText, key: 'st_assigned' },
    inProgress: { color: c.warning, key: 'st_inProgress' },
    done: { color: c.success, key: 'st_done' },
  };
  const m = map[status];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: c.surfaceAlt }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: m.color }} />
      <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: m.color }}>{t(m.key)}</Text>
    </View>
  );
}

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  const { c } = useApp();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: c.gold }}>
      <Text style={{ fontFamily: fonts.semi, fontSize: size * 0.36, color: c.onPrimary }}>{initials}</Text>
    </View>
  );
}

export function Stars({ value, onChange, size = 28 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="adjustable" accessibilityValue={{ min: 0, max: 5, now: value }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} disabled={!onChange} onPress={() => onChange?.(n)} hitSlop={6} accessibilityLabel={`${n}/5`}>
          <Icon name={n <= value ? 'star' : 'star-outline'} size={size} color={c.gold} />
        </Pressable>
      ))}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { c } = useApp();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 28, marginBottom: 12 }}>
      <Txt variant="h2">{title}</Txt>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: c.goldText }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}) {
  const { c } = useApp();
  return (
    <View style={{ marginBottom: 16 }}>
      <Txt variant="label" style={{ marginBottom: 8 }}>{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={{
          minHeight: multiline ? 100 : 50,
          textAlignVertical: multiline ? 'top' : 'center',
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radius.sm,
          backgroundColor: c.surface,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontFamily: fonts.body,
          fontSize: 15,
          color: c.text,
        }}
      />
    </View>
  );
}

function SegmentedRole() {
  const { c, t, role, setRole } = useApp();
  const opts: { id: 'user' | 'company'; label: string; icon: string }[] = [
    { id: 'user', label: t('user'), icon: 'person-outline' },
    { id: 'company', label: t('company'), icon: 'business-outline' },
  ];
  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.surfaceAlt, borderRadius: radius.pill, padding: 3 }}>
      {opts.map((o) => {
        const sel = role === o.id;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: sel }}
            onPress={() => setRole(o.id)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 38, borderRadius: radius.pill, backgroundColor: sel ? c.primary : 'transparent' }}
          >
            <Icon name={o.icon} size={15} color={sel ? c.onPrimary : c.textMuted} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: sel ? c.onPrimary : c.textMuted }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AppHeader() {
  const { c, t, lang, setLang, isDark, toggleDark } = useApp();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10, gap: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#0B132B', borderWidth: 1, borderColor: c.gold, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="key-outline" size={17} color="#D4B47A" />
        </View>
        <View>
          <Text style={{ fontFamily: fonts.title, fontSize: 20, color: c.text, lineHeight: 22 }}>Nova</Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 9, letterSpacing: 1.2, color: c.goldText }}>{t('pilot')}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('language')}
          onPress={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          style={{ minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text }}>{lang === 'fr' ? 'EN' : 'FR'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('darkMode')}
          onPress={toggleDark}
          style={{ minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={c.text} />
        </Pressable>
      </View>
    </View>
    <SegmentedRole />
    </View>
  );
}

export function TestBanner() {
  const { c, t, setFeedbackOpen } = useApp();
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm, backgroundColor: c.surfaceAlt, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
        <Icon name="flask-outline" size={14} color={c.goldText} />
        <Txt variant="caption" numberOfLines={1} style={{ flex: 1 }}>{t('testBanner')}</Txt>
      </View>
      <Pressable onPress={() => setFeedbackOpen(true)} hitSlop={8} accessibilityRole="button">
        <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: c.goldText }}>{t('giveFeedback')}</Text>
      </Pressable>
    </View>
  );
}

export function Screen({ children, scroll = true, title }: { children: React.ReactNode; scroll?: boolean; title?: string }) {
  const { c } = useApp();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader />
      <TestBanner />
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
          {title ? <Txt variant="h1" style={{ marginTop: 8, marginBottom: 4 }}>{title}</Txt> : null}
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function FeedbackModal() {
  const { c, t, feedbackOpen, setFeedbackOpen, addFeedback } = useApp();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const close = () => {
    setFeedbackOpen(false);
    setTimeout(() => {
      setRating(0);
      setText('');
      setSent(false);
    }, 300);
  };
  return (
    <Modal visible={feedbackOpen} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: c.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: 24, paddingBottom: 40 }}>
          {sent ? (
            <View style={{ alignItems: 'center', gap: 12 }}>
              <Icon name="checkmark-circle" size={48} color={c.success} />
              <Txt variant="h2" style={{ textAlign: 'center' }}>{t('feedbackThanks')}</Txt>
              <Button label={t('close')} onPress={close} style={{ alignSelf: 'stretch', marginTop: 8 }} />
            </View>
          ) : (
            <>
              <Txt variant="h1" style={{ marginBottom: 16 }}>{t('feedbackModalTitle')}</Txt>
              <Stars value={rating} onChange={setRating} size={34} />
              <View style={{ height: 16 }} />
              <Field label={t('description')} value={text} onChangeText={setText} placeholder={t('feedbackPh')} multiline />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button label={t('cancel')} variant="ghost" onPress={close} style={{ flex: 1 }} />
                <Button
                  label={t('send')}
                  disabled={rating === 0}
                  onPress={() => {
                    addFeedback(rating, text.trim());
                    setSent(true);
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
