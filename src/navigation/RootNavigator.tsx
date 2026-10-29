import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../AppContext';
import { Icon } from '../components/ui';
import { fonts } from '../theme';
import type { CompanyTabParamList, RootStackParamList, UserTabParamList } from './types';

import Onboarding from '../screens/Onboarding';
import Home from '../screens/user/Home';
import Services from '../screens/user/Services';
import Requests from '../screens/user/Requests';
import Messages from '../screens/user/Messages';
import Profile from '../screens/user/Profile';
import NewRequest from '../screens/user/NewRequest';
import Assistant from '../screens/user/Assistant';
import RequestDetail from '../screens/user/RequestDetail';
import Dashboard from '../screens/company/Dashboard';
import Members from '../screens/company/Members';
import Rules from '../screens/company/Rules';
import Feedback from '../screens/company/Feedback';
import Subscription from '../screens/company/Subscription';

const Stack = createNativeStackNavigator<RootStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();
const CompanyTab = createBottomTabNavigator<CompanyTabParamList>();

function useTabOptions() {
  const { c } = useApp();
  return {
    headerShown: false,
    tabBarActiveTintColor: c.goldText,
    tabBarInactiveTintColor: c.textMuted,
    tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, height: 64, paddingTop: 6 },
    tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, paddingBottom: 4 },
  };
}

function UserTabs() {
  const { t, requests } = useApp();
  const opts = useTabOptions();
  const ongoing = requests.filter((r) => r.status !== 'done').length;
  const icon = (name: string) => ({ color, size }: { color: string; size: number }) => <Icon name={name} size={size} color={color} />;
  return (
    <UserTab.Navigator screenOptions={opts}>
      <UserTab.Screen name="Home" component={Home} options={{ title: t('tabHome'), tabBarIcon: icon('home-outline') }} />
      <UserTab.Screen name="Services" component={Services} options={{ title: t('servicesTitle'), tabBarIcon: icon('grid-outline') }} />
      <UserTab.Screen name="Requests" component={Requests} options={{ title: t('tabRequests'), tabBarIcon: icon('list-outline'), tabBarBadge: ongoing || undefined }} />
      <UserTab.Screen name="Messages" component={Messages} options={{ title: t('messagesTitle'), tabBarIcon: icon('chatbubbles-outline') }} />
      <UserTab.Screen name="Profile" component={Profile} options={{ title: t('profileTitle'), tabBarIcon: icon('person-outline') }} />
    </UserTab.Navigator>
  );
}

function CompanyTabs() {
  const { t } = useApp();
  const opts = useTabOptions();
  const icon = (name: string) => ({ color, size }: { color: string; size: number }) => <Icon name={name} size={size} color={color} />;
  return (
    <CompanyTab.Navigator screenOptions={opts}>
      <CompanyTab.Screen name="Dashboard" component={Dashboard} options={{ title: t('tabDashboard'), tabBarIcon: icon('stats-chart-outline') }} />
      <CompanyTab.Screen name="Members" component={Members} options={{ title: t('members'), tabBarIcon: icon('people-outline') }} />
      <CompanyTab.Screen name="Rules" component={Rules} options={{ title: t('rules'), tabBarIcon: icon('options-outline') }} />
      <CompanyTab.Screen name="Feedback" component={Feedback} options={{ title: t('feedback'), tabBarIcon: icon('chatbox-ellipses-outline') }} />
      <CompanyTab.Screen name="Subscription" component={Subscription} options={{ title: t('tabPlan'), tabBarIcon: icon('diamond-outline') }} />
    </CompanyTab.Navigator>
  );
}

function Main() {
  const { role } = useApp();
  return role === 'user' ? <UserTabs /> : <CompanyTabs />;
}

export default function RootNavigator() {
  const { c, t, isDark } = useApp();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme: Theme = {
    ...base,
    colors: { ...base.colors, background: c.bg, card: c.surface, text: c.text, border: c.border, primary: c.goldText },
  };
  const modalHeader = {
    headerShown: true,
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.text,
    headerTitleStyle: { fontFamily: fonts.titleSemi, fontSize: 18 },
    headerShadowVisible: false,
  };
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="NewRequest" component={NewRequest} options={{ ...modalHeader, presentation: 'modal', title: t('newRequest') }} />
        <Stack.Screen name="Assistant" component={Assistant} options={{ ...modalHeader, presentation: 'modal', title: t('assistantTitle') }} />
        <Stack.Screen name="RequestDetail" component={RequestDetail} options={{ ...modalHeader, title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
