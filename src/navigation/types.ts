import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoryId } from '../data';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  NewRequest: { category?: CategoryId; title?: string } | undefined;
  Assistant: { initial?: string } | undefined;
  RequestDetail: { id: string };
};

export type UserTabParamList = {
  Home: undefined;
  Services: undefined;
  Requests: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type CompanyTabParamList = {
  Dashboard: undefined;
  Members: undefined;
  Rules: undefined;
  Feedback: undefined;
  Subscription: undefined;
};

export type RootProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
