import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  TeamDetails: { teamId: string; teamName?: string };
};

export type FavouritesStackParamList = {
  Favourites: undefined;
  TeamDetails: { teamId: string; teamName?: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavouritesTab: NavigatorScreenParams<FavouritesStackParamList>;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
